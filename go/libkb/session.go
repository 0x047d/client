// Copyright 2015 Keybase, Inc. All rights reserved. Use of
// this source code is governed by the included BSD license.

package libkb

import (
	"fmt"
	"time"

	keybase1 "github.com/keybase/client/go/protocol"
)

type SessionReader interface {
	APIArgs() (token, csrf string)
	IsLoggedIn() bool
	Invalidate()
}

type Session struct {
	Contextified
	token    string
	csrf     string
	deviceID keybase1.DeviceID
	valid    bool
	uid      keybase1.UID
	username *NormalizedUsername
	mtime    time.Time
	checked  bool
}

func newSession(g *GlobalContext) *Session {
	return &Session{Contextified: Contextified{g}}
}

func (s *Session) IsLoggedIn() bool {
	ok, err := s.loadAndCheck()
	if err != nil {
		s.G().Log.Debug("IsLoggedIn, loadAndCheck error: %s", err)
		return false
	}
	return ok
}

// true if user is logged in and has a device fully provisioned
func (s *Session) IsLoggedInAndProvisioned() bool {
	ok, err := s.loadAndCheck()
	if err != nil {
		s.G().Log.Debug("IsLoggedInAndProvisioned, loadAndCheck error: %s", err)
		return false
	}
	if !ok {
		return false
	}
	if !s.valid {
		return false
	}
	if len(s.deviceID) == 0 {
		s.G().Log.Debug("no device id in session")
		return false
	}
	envid := s.G().Env.GetDeviceID()
	if envid.IsNil() {
		s.G().Log.Debug("no device id in env")
		return false
	}
	if s.deviceID != envid {
		s.G().Log.Warning("device id mismatch session <-> env")
		return false
	}

	return true
}

func (s *Session) GetUsername() *NormalizedUsername {
	return s.username
}

func (s *Session) GetUID() keybase1.UID {
	return s.uid
}

func (s *Session) GetToken() string {
	return s.token
}

func (s *Session) APIArgs() (token, csrf string) {
	return s.token, s.csrf
}

func (s *Session) SetUsername(username NormalizedUsername) {
	s.username = &username
}

func (s *Session) SetLoggedIn(sessionID, csrfToken string, username NormalizedUsername, uid keybase1.UID, deviceID keybase1.DeviceID) error {
	s.valid = true
	s.uid = uid
	s.username = &username
	s.token = sessionID
	s.csrf = csrfToken
	s.deviceID = deviceID
	s.mtime = time.Now()

	return nil
}

func (s *Session) SetDeviceProvisioned(devid keybase1.DeviceID) error {
	s.G().Log.Debug("Local Session:  setting provisioned device id: %s", devid)
	s.deviceID = devid
	return nil
}

func (s *Session) isRecent() bool {
	if s.mtime.IsZero() {
		return false
	}
	return time.Since(s.mtime) < time.Hour
}

func (s *Session) check() error {
	s.G().Log.Debug("+ Checking session")
	if s.isRecent() && s.checked {
		s.G().Log.Debug("- session is recent, short-circuiting")
		s.valid = true
		return nil
	}

	res, err := s.G().API.Get(APIArg{
		SessionR:       s,
		Endpoint:       "sesscheck",
		NeedSession:    true,
		AppStatusCodes: []int{SCOk, SCBadSession},
	})

	if err != nil {
		return err
	}

	s.checked = true

	if res.AppStatus.Code == SCOk {
		s.G().Log.Debug("| Stored session checked out")
		var err error
		var uid keybase1.UID
		var username, csrf string
		GetUIDVoid(res.Body.AtKey("logged_in_uid"), &uid, &err)
		res.Body.AtKey("username").GetStringVoid(&username, &err)
		res.Body.AtKey("csrf_token").GetStringVoid(&csrf, &err)
		if err != nil {
			err = fmt.Errorf("Server replied with unrecognized response: %s", err)
			return err
		}
		s.valid = true
		s.uid = uid
		nu := NewNormalizedUsername(username)
		s.username = &nu
		s.csrf = csrf
	} else {
		s.G().Log.Notice("Stored session expired")
		s.Invalidate()
	}

	s.G().Log.Debug("- Checked session")
	return nil
}

// Invalidate marks the session as invalid and posts a logout
// notification.
func (s *Session) Invalidate() {
	s.G().Log.Debug("+ invalidating session")
	s.valid = false
	s.mtime = time.Time{}
	s.token = ""
	s.csrf = ""
	s.checked = false
	s.G().NotifyRouter.HandleLogout()
	s.G().Log.Debug("- session invalidated")
}

func (s *Session) HasSessionToken() bool {
	return len(s.token) > 0
}

func (s *Session) postLogout() error {
	_, err := s.G().API.Post(APIArg{
		SessionR:    s,
		Endpoint:    "logout",
		NeedSession: true,
	})

	// Invalidate even if we hit an error.
	s.Invalidate()

	return err
}

func (s *Session) Logout() error {
	if s.HasSessionToken() {
		return s.postLogout()
	}
	return nil
}

func (s *Session) loadAndCheck() (bool, error) {
	var err error
	if s.HasSessionToken() {
		err = s.check()
	}
	return s.valid, err
}

func (s *Session) loadAndCheckProvisioned() (bool, error) {
	ok, err := s.loadAndCheck()
	if err != nil {
		return false, err
	}
	if !ok {
		return false, nil
	}
	return s.IsLoggedInAndProvisioned(), nil
}
