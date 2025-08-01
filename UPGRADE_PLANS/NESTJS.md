# NestJS Upgrade Plan: 9.3.9 → 11.1.2

## Overview

This document outlines the plan for upgrading NestJS from version 9.3.9 to 11.1.2 in the IEN project. This is a **major version upgrade** spanning two major releases (9 → 10 → 11) with several breaking changes and dependency compatibility requirements.

⚠️ **WARNING**: This is a medium-risk upgrade that requires careful testing due to dependency version changes and lifecycle hook behavior modifications.

## Current State Analysis

### Version Status
- **Current @nestjs/core**: 9.3.9
- **Current @nestjs/common**: 9.3.9
- **Current @nestjs/platform-express**: 9.4.3
- **Target @nestjs/core**: 11.1.2
- **Target @nestjs/common**: 11.1.2
- **Target @nestjs/platform-express**: 11.1.2

### Dependencies Requiring Updates
- **@nestjs/typeorm**: 8.0.2 → 10.x (BREAKING CHANGE)
- **@nestjs/swagger**: 5.1.5 → 7.x (BREAKING CHANGE)
- **@nestjs/event-emitter**: 2.1.1 → 2.x (likely compatible)
- **@nestjs/cli**: 8.0.0 → 10.x
- **@nestjs/schematics**: 8.0.0 → 10.x
- **@nestjs/testing**: 9.3.9 → 11.1.2

### Codebase Analysis
- **Module Count**: 9 modules using @Module decorator
- **Dynamic Modules**: 7 modules using forRoot/forFeature
- **Lifecycle Hooks**: 2 services implement lifecycle hooks
- **Reflector Usage**: 1 file uses Reflector API
- **Express Integration**: Standard NestJS patterns, no custom Express routing

## Breaking Changes & Impact Analysis

### 1. Express v5 Integration ⚠️ **LOW RISK**

**Issue**: NestJS 11 integrates Express v5 with route syntax changes
- Wildcards must be named (e.g., `*splat`)
- Optional parameters require braces (e.g., `/:file{.:ext}`)

**Impact Assessment**: 
✅ **No Impact** - Codebase uses standard NestJS decorators (@Get, @Post, etc.)
✅ **No Impact** - No custom Express router configurations found
✅ **No Impact** - No wildcard or optional parameter routes detected

**Required Actions**: None

### 2. Dynamic Module Behavior Change ⚠️ **LOW-MEDIUM RISK**

**Issue**: Dynamic modules with identical configurations now create separate instances

**Affected Files**:
- `database/database.module.ts` - TypeOrmModule.forRoot()
- `applicant/applicant.module.ts` - TypeOrmModule.forFeature(), EventEmitterModule.forRoot()
- `report/report.module.ts` - TypeOrmModule.forFeature()
- `employee/employee.module.ts` - TypeOrmModule.forFeature()
- `form/form.module.ts` - TypeOrmModule.forFeature()
- `mail/mail.module.ts` - TypeOrmModule.forFeature()
- `admin/admin.module.ts` - TypeOrmModule.forFeature()

**Current Pattern**:
```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([IENApplicant, IENApplicantStatus]),
    EventEmitterModule.forRoot({ wildcard: true }),
  ],
})
```

**Required Actions**:
1. **Review module imports** to identify any duplicate configurations
2. **Test application startup** to ensure proper module initialization
3. **Monitor for singleton behavior issues** in services

### 3. Lifecycle Hooks Order Reversal ⚠️ **MEDIUM RISK**

**Issue**: Termination lifecycle hooks now run in reverse order

**Affected Files**:
- `report/report.service.ts` - implements lifecycle hooks
- `applicant/endofjourney.service.ts` - implements lifecycle hooks

**Current Implementation Analysis**:
```typescript
// Need to verify implementation details
// Hooks: OnModuleDestroy, OnApplicationShutdown, OnModuleInit
```

**Required Actions**:
1. **Review lifecycle hook implementations** in both services
2. **Test application shutdown behavior** thoroughly
3. **Update hook logic** if shutdown order is critical
4. **Document new shutdown sequence** for future reference

### 4. Reflector API Changes ⚠️ **LOW RISK**

**Issue**: 
- `getAllAndOverride` returns `T | undefined` instead of `T`
- `getAllAndMerge` behavior changes for object metadata

**Affected Files**:
- `auth/auth.guard.ts:37`

**Current Implementation**:
```typescript
const acl = this.reflector.get<Access[]>('acl', context.getHandler()) || [];
```

**Assessment**: ✅ **Already Handled** - Code uses fallback `|| []` pattern

**Required Actions**: None - current implementation is compatible

### 5. Cache Module Breaking Changes ⚠️ **NO RISK**

**Issue**: CacheModule updated with breaking changes

**Assessment**: ✅ **Not Used** - No CacheModule usage found in codebase

**Required Actions**: None

### 6. Dependency Compatibility Issues ⚠️ **HIGH RISK**

#### @nestjs/typeorm: 8.0.2 → 10.x

**Issue**: Major version upgrade required for NestJS 11 compatibility

**Current Usage**:
```typescript
// database.module.ts
imports: [TypeOrmModule.forRoot(appOrmConfig)]

// Multiple modules
imports: [TypeOrmModule.forFeature([Entity1, Entity2])]
```

**Potential Breaking Changes**:
- TypeORM integration API changes
- Entity registration changes
- Configuration option changes

**Required Actions**:
1. **Update to @nestjs/typeorm ^10.0.0**
2. **Test all database connections and operations**
3. **Verify entity registration still works**
4. **Check configuration compatibility**

#### @nestjs/swagger: 5.1.5 → 7.x

**Issue**: Major version upgrade required

**Current Usage**:
```typescript
// common/documentation.ts (referenced in app.config.ts)
if (process.env.NODE_ENV !== 'production') {
  Documentation(app);
}
```

**Potential Breaking Changes**:
- Swagger UI configuration changes
- API documentation generation changes
- Decorator behavior changes

**Required Actions**:
1. **Update to @nestjs/swagger ^7.0.0**
2. **Test API documentation generation**
3. **Verify Swagger UI functionality**
4. **Update any custom Swagger configurations**

## Detailed Upgrade Implementation Plan

### Phase 1: Pre-Upgrade Preparation (1 day)

#### Step 1.1: Environment Setup and Backup
1. **Create git branch for upgrade**:
   ```bash
   git checkout -b nestjs-11-upgrade
   ```

2. **Document current application behavior**:
   ```bash
   # Test current functionality
   make api-unit-test
   make api-integration-test
   make start-local # Verify application starts correctly
   ```

3. **Backup package-lock.json**:
   ```bash
   cp package-lock.json package-lock.json.backup
   ```

#### Step 1.2: Dependency Analysis
1. **Install npm-check-updates globally**:
   ```bash
   npm install -g npm-check-updates
   ```

2. **Review all NestJS dependencies**:
   ```bash
   ncu -f "/^@nestjs/" --format repo
   ```

3. **Check for breaking changes documentation**:
   - Review NestJS 10.x migration guide
   - Review NestJS 11.x migration guide
   - Check @nestjs/typeorm 10.x changelog
   - Check @nestjs/swagger 7.x changelog

### Phase 2: Development Environment Upgrade (0.5 days)

#### Step 2.1: Update package.json Dependencies

**File: `apps/api/package.json`**

Update the following dependencies:
```json
{
  "dependencies": {
    "@nestjs/common": "11.1.2",
    "@nestjs/core": "11.1.2",
    "@nestjs/event-emitter": "^2.1.1",
    "@nestjs/platform-express": "11.1.2",
    "@nestjs/swagger": "^7.0.0",
    "@nestjs/typeorm": "^10.0.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "11.1.2"
  }
}
```

#### Step 2.2: Clean Installation
```bash
# Remove existing installations
rm -rf node_modules package-lock.json

# Fresh installation
yarn install
```

#### Step 2.3: Initial Compatibility Check
```bash
# Check if application compiles
make build-api

# Check for TypeScript errors
npx tsc --noEmit
```

### Phase 3: Code Migration and Fixes (0.5 days)

#### Step 3.1: Review Lifecycle Hook Implementations

**Files to Review**:
1. `apps/api/src/report/report.service.ts`
2. `apps/api/src/applicant/endofjourney.service.ts`

**Tasks**:
```typescript
// Review implementation patterns
// Check for dependencies on shutdown order
// Document any critical shutdown sequences
// Test shutdown behavior changes
```

#### Step 3.2: Test Dynamic Module Behavior

**Module Files to Test**:
- All modules with `forRoot()` or `forFeature()` calls
- Verify singleton behavior where expected
- Check for duplicate module registrations

**Testing Approach**:
```bash
# Start application and monitor logs
make start-local

# Check for module initialization warnings
# Verify database connections work
# Test event emitter functionality
```

#### Step 3.3: Update Swagger Documentation (if needed)

**File: Check implementation in `apps/api/src/common/documentation.ts`**

Potential updates needed:
```typescript
// May need updates for Swagger 7.x compatibility
// Check SwaggerModule.setup() calls
// Verify DocumentBuilder configuration
// Test API documentation generation
```

### Phase 4: Testing & Validation (1 day)

#### Step 4.1: Unit Testing
```bash
# Run all unit tests
make api-unit-test

# Focus on critical service tests
yarn test --testPathPattern=auth.guard.spec.ts
yarn test --testPathPattern=report.service.spec.ts
yarn test --testPathPattern=endofjourney.service.spec.ts
```

#### Step 4.2: Integration Testing
```bash
# Test database operations
make api-integration-test

# Test application startup/shutdown
make start-local
# Ctrl+C to test graceful shutdown

# Test API documentation
curl http://localhost:4000/api/docs
```

#### Step 4.3: Manual Testing Checklist

**Application Startup**:
- [ ] Application starts without errors
- [ ] All modules initialize correctly
- [ ] Database connections established
- [ ] TypeORM entities loaded properly

**API Functionality**:
- [ ] Authentication works (auth.guard.ts)
- [ ] CRUD operations function correctly
- [ ] API documentation accessible
- [ ] Swagger UI displays properly

**Lifecycle Behavior**:
- [ ] Application shutdown gracefully
- [ ] Lifecycle hooks execute in correct order
- [ ] No resource leaks during shutdown

**Module Behavior**:
- [ ] Dynamic modules instantiate correctly
- [ ] No duplicate module warnings
- [ ] Event emitter functionality works
- [ ] TypeORM repositories accessible

### Phase 5: Performance & Compatibility Validation (0.5 days)

#### Step 5.1: Performance Testing
```bash
# Compare startup times
time make start-local

# Monitor memory usage
# Check for performance regressions
# Verify response times are similar
```

#### Step 5.2: Dependency Compatibility
```bash
# Check for peer dependency warnings
yarn install --check-files

# Verify all imports resolve correctly
npx tsc --noEmit

# Test build process
make build-api
```

## Risk Mitigation Strategies

### Critical Risk Areas

#### 1. TypeORM Integration Changes ⚠️ **HIGH RISK**
**Risk**: @nestjs/typeorm 10.x may have breaking changes
**Mitigation**:
- Test all database operations thoroughly
- Verify entity registration and relationships
- Check configuration option compatibility
- Have rollback plan ready

#### 2. Swagger Documentation Generation ⚠️ **MEDIUM RISK**
**Risk**: @nestjs/swagger 7.x may break API documentation
**Mitigation**:
- Test documentation generation in development
- Verify Swagger UI functionality
- Check all API endpoints are documented
- Update configuration if needed

#### 3. Application Shutdown Behavior ⚠️ **MEDIUM RISK**
**Risk**: Lifecycle hook order changes may affect shutdown
**Mitigation**:
- Document current shutdown behavior
- Test shutdown sequences thoroughly
- Monitor for resource leaks
- Update hook implementations if needed

#### 4. Module Initialization Changes ⚠️ **LOW-MEDIUM RISK**
**Risk**: Dynamic module behavior changes may cause issues
**Mitigation**:
- Monitor application startup logs
- Test all module functionality
- Check for singleton behavior issues
- Verify service injections work correctly

### Rollback Plan

#### Quick Rollback Triggers
- Application fails to start
- Critical API functionality breaks
- Database connectivity issues
- Authentication system failures
- Significant performance degradation (>30% slower)

#### Rollback Procedure
1. **Immediate Response**:
   ```bash
   # Switch to backup branch
   git checkout main
   
   # Restore package files
   cp package-lock.json.backup package-lock.json
   
   # Clean installation
   rm -rf node_modules
   yarn install
   ```

2. **Verification**:
   ```bash
   # Test application functionality
   make api-unit-test
   make start-local
   
   # Verify all systems operational
   ```

3. **Communication**:
   - Document issues encountered
   - Notify team of rollback completion
   - Plan resolution strategy

## Success Criteria

### Technical Success Metrics
- [ ] All unit tests pass (>95% success rate)
- [ ] All integration tests pass (>90% success rate)
- [ ] Application starts without errors
- [ ] All API endpoints function correctly
- [ ] Database operations work properly
- [ ] Authentication system functions
- [ ] API documentation generates correctly
- [ ] No TypeScript compilation errors
- [ ] No critical performance regressions

### Business Success Metrics
- [ ] No user-facing functionality breaks
- [ ] All critical workflows function:
  - User authentication and authorization
  - Applicant management operations
  - Report generation
  - Data synchronization
  - File uploads and downloads
- [ ] API response times remain acceptable
- [ ] System stability maintained

### Operational Success Metrics
- [ ] Deployment process works correctly
- [ ] Application monitoring shows stable performance
- [ ] No increase in error rates
- [ ] Graceful shutdown behavior maintained
- [ ] Support tickets related to upgrade < 3 within 48 hours

## Timeline & Resource Allocation

### Development Phase (2.5 days)
- **Phase 1** (Preparation): 1 day - Senior developer
- **Phase 2** (Upgrade): 0.5 day - Senior developer
- **Phase 3** (Code Migration): 0.5 day - Senior developer
- **Phase 4** (Testing): 1 day - Senior developer + QA engineer
- **Phase 5** (Validation): 0.5 day - Senior developer

**Total Estimated Time**: 2.5 days
**Team Required**: Senior developer, QA engineer

## Alternative Recommendations

### Option 1: Gradual Upgrade Approach (Recommended)
**Phase 1**: Upgrade to NestJS 10.x first
- Lower risk migration path
- Easier to isolate issues
- Better testing opportunities

**Phase 2**: Upgrade to NestJS 11.x after stabilization
- Build on proven 10.x foundation
- Focus on 11.x specific changes
- Reduced complexity per phase

### Option 2: Direct Upgrade (Current Plan)
**Pros**:
- Single migration effort
- Faster to latest version
- All features available immediately

**Cons**:
- Higher complexity
- More difficult to isolate issues
- Requires more thorough testing

### Option 3: Postpone Upgrade
**Considerations**:
- NestJS 9.x still supported
- Focus on business features first
- Plan upgrade for dedicated sprint

## New Features Available in NestJS 11

### Enhanced ConsoleLogger
- Built-in JSON logging support
- Better integration with log aggregation tools
- Improved development experience

### New ParseDatePipe
```typescript
// Available in @nestjs/common
import { ParseDatePipe } from '@nestjs/common';

@Get(':date')
getData(@Param('date', ParseDatePipe) date: Date) {
  return this.service.getDataByDate(date);
}
```

### IntrinsicException
```typescript
// For exceptions that shouldn't be auto-logged
import { IntrinsicException } from '@nestjs/common';

throw new IntrinsicException('Internal processing error');
```

## Conclusion & Final Recommendation

**✅ RECOMMENDED: PROCEED WITH GRADUAL UPGRADE**

This NestJS upgrade is **MEDIUM RISK** but **HIGHLY BENEFICIAL**:

### Benefits:
1. **Security Updates**: Latest security patches and improvements
2. **Performance**: Optimized module initialization and startup times
3. **Developer Experience**: Enhanced logging and debugging capabilities
4. **Future Compatibility**: Better foundation for future updates
5. **Modern Features**: Access to latest NestJS capabilities

### Recommended Approach:
1. **Start with NestJS 10.x upgrade** to reduce complexity
2. **Thorough testing at each phase** to ensure stability
3. **Focus on dependency compatibility** especially TypeORM and Swagger
4. **Monitor lifecycle hook behavior** changes carefully

### Key Success Factors:
- **Comprehensive testing** of all critical functionality
- **Careful monitoring** of application startup and shutdown
- **Immediate rollback capability** if issues arise
- **Team coordination** during upgrade process

The upgrade should proceed when development resources are available for dedicated focus, ideally during a maintenance window or between major feature releases.