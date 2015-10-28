//
//  KBFSConfig.h
//  Keybase
//
//  Created by Gabriel on 8/29/15.
//  Copyright (c) 2015 Keybase. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "KBPath.h"
#import "KBEnvConfig.h"

@interface KBFSConfig : NSObject

- (instancetype)initWithConfig:(KBEnvConfig *)config;

- (NSDictionary *)launchdPlistDictionary:(NSString *)label;

- (NSString *)commandLineWithPathOptions:(KBPathOptions)pathOptions;

@end
