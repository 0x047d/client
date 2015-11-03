//
//  KBInstallable.h
//  Keybase
//
//  Created by Gabriel on 5/18/15.
//  Copyright (c) 2015 Gabriel Handford. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <KBKit/KBEnvConfig.h>
#import <KBKit/KBComponent.h>
#import <KBKit/KBComponentStatus.h>

typedef void (^KBOnComponentStatus)(KBComponentStatus *installStatus);

@protocol KBInstallable <KBComponent>

- (BOOL)isInstallDisabled;

- (KBComponentStatus *)componentStatus;

- (void)refreshComponent:(KBCompletion)completion;

- (void)install:(KBCompletion)completion;
- (void)uninstall:(KBCompletion)completion;

- (void)start:(KBCompletion)completion;
- (void)stop:(KBCompletion)completion;

@end

@interface KBInstallableComponent : KBComponent

@property (nonatomic) KBComponentStatus *componentStatus;
@property (readonly) KBEnvConfig *config;

@property (getter=isInstallDisabled) BOOL installDisabled;

- (instancetype)initWithConfig:(KBEnvConfig *)config;

// Called when component updated
- (void)componentDidUpdate;

@end
