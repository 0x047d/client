// Copyright 2015 Keybase, Inc. All rights reserved. Use of
// this source code is governed by the included BSD license.

package engine

import (
	"testing"

	"github.com/keybase/client/go/libkb"
)

func TestLoadUserPlusKeysHasKeys(t *testing.T) {
	tc := SetupEngineTest(t, "user")
	defer tc.Cleanup()

	CreateAndSignupFakeUser(tc, "login")
	me, err := libkb.LoadMe(libkb.NewLoadUserArg(tc.G))
	if err != nil {
		t.Fatal(err)
	}
	up, err := libkb.LoadUserPlusKeys(tc.G, me.GetUID())
	if err != nil {
		t.Fatal(err)
	}
	if len(up.DeviceKeys) != 4 {
		t.Errorf("num device keys: %d, expected 4", len(up.DeviceKeys))
	}
}

func TestLoadUserPlusKeysRevoked(t *testing.T) {
	tc := SetupEngineTest(t, "login")
	defer tc.Cleanup()

	fu := CreateAndSignupFakeUser(tc, "login")
	me, err := libkb.LoadMe(libkb.NewLoadUserArg(tc.G))
	if err != nil {
		t.Fatal(err)
	}
	up, err := libkb.LoadUserPlusKeys(tc.G, me.GetUID())
	if err != nil {
		t.Fatal(err)
	}

	if len(up.DeviceKeys) != 4 {
		t.Errorf("device keys: %d, expected 4", len(up.DeviceKeys))
	}
	if len(up.RevokedKeys) != 0 {
		t.Errorf("revoked keys: %d, expected 0", len(up.RevokedKeys))
	}

	devices, _ := getActiveDevicesAndKeys(tc, fu)
	var paper *libkb.Device
	for _, device := range devices {
		if device.Type == libkb.DeviceTypePaper {
			paper = device
			break
		}
	}

	if err := doRevokeDevice(tc, fu, paper.ID, false); err != nil {
		t.Fatal(err)
	}

	up2, err := libkb.LoadUserPlusKeys(tc.G, me.GetUID())
	if err != nil {
		t.Fatal(err)
	}

	if len(up2.DeviceKeys) != 2 {
		t.Errorf("device keys: %d, expected 2", len(up2.DeviceKeys))
	}
	if len(up2.RevokedKeys) != 2 {
		t.Errorf("revoked keys: %d, expected 2", len(up2.RevokedKeys))
	}
}
