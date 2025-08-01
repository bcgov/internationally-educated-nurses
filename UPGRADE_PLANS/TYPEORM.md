# TypeORM Upgrade Plan: 0.2.45 → 0.3.20

## Overview

This document outlines the plan for upgrading TypeORM from version 0.2.45 to 0.3.20 in the IEN project. This is a **major version upgrade** with significant breaking changes that affects core database operations, migrations, and repository patterns.

⚠️ **WARNING**: This is a high-risk upgrade that requires extensive testing and careful migration planning due to the large number of database migrations and critical data dependencies.

## Current State Analysis

### Version Status
- **Current TypeORM**: 0.2.45
- **Current @nestjs/typeorm**: 8.0.2
- **Target TypeORM**: 0.3.20
- **Required @nestjs/typeorm**: ^10.0.0

### Database Configuration
- **Database**: PostgreSQL
- **Configuration**: `src/ormconfig.ts` (will be deprecated)
- **Migration Strategy**: ✅ **Proper** - `synchronize: false`, `migrationsRun: true`
- **Migration Files**: 78+ migration files from 2021-2025
- **Database Module**: NestJS TypeORM integration

### Code Usage Analysis
- **Entity Files**: 20+ entity classes with decorators
- **Service Files**: 15+ services using repositories
- **Repository Usage**: 120+ TypeORM decorator/method usages across 34 files
- **Migration Commands**: CLI-based migration management
- **Query Patterns**: Complex QueryBuilder usage throughout application

## Breaking Changes & Impact Analysis

### 1. Connection → DataSource Migration ⚠️ **CRITICAL CHANGE**

**Issue**: TypeORM 0.3.x replaces "Connection" concept with "DataSource"

**Affected Files**:
- `apps/api/src/ormconfig.ts` - Current configuration file
- `apps/api/src/database/database.module.ts` - NestJS integration
- `apps/api/package.json` - CLI commands

**Current Pattern**:
```typescript
// ormconfig.ts
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: PostgresConnectionOptions = {
  host: process.env.POSTGRES_HOST,
  type: 'postgres',
  // ... configuration
};
export default config;

// database.module.ts
@Module({
  imports: [TypeOrmModule.forRoot(appOrmConfig)],
})
export class DatabaseModule {}
```

**Required Changes**:
```typescript
// NEW: data-source.ts
import { DataSource } from 'typeorm';
import { DatabaseNamingStrategy } from './database/database.naming-strategy';
import DatabaseLogger from './database/database-logger';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +(process.env.PORTGRES_PORT || 5432),
  username: process.env.POSTGRES_USERNAME || 'freshworks',
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE || 'ien',
  entities: [__dirname + '/**/entity/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migration/*{.ts,.js}'],
  subscribers: [__dirname + '/**/*.subscriber{.ts,.js}'],
  synchronize: false,
  migrationsRun: true,
  namingStrategy: new DatabaseNamingStrategy(),
  logging: !!process.env.DEBUG,
  logger: process.env.DEBUG ? new DatabaseLogger() : undefined,
});

// UPDATED: database.module.ts
@Module({
  imports: [TypeOrmModule.forRoot({
    ...AppDataSource.options,
    autoLoadEntities: true,
  })],
})
export class DatabaseModule {}
```

### 2. Repository Method Breaking Changes ⚠️ **HIGH RISK**

**Issue**: Core repository methods have changed signatures and behavior

**Affected Methods**:
- `findOne()` - No longer accepts ID as first parameter
- `find()` - Stricter parameter validation
- `delete({})` / `update({}, {...})` - Empty criteria now throws errors
- `findByIds()` - Deprecated, use `findBy()` with `In()` operator

**Current Usage Patterns** (from ienapplicant.service.ts):
```typescript
import { FindManyOptions, getManager, In, IsNull, Repository } from 'typeorm';

// Current patterns that will break:
repository.findOne(applicantId)
repository.findOne()
repository.delete({})
repository.update({}, updateData)
repository.findByIds([id1, id2, id3])
```

**Required Migration Patterns**:
```typescript
// BEFORE (0.2.x):
repository.findOne(applicantId)
repository.findOne()
repository.delete({})
repository.update({}, { status: 'updated' })
repository.findByIds([id1, id2, id3])

// AFTER (0.3.x):
repository.findOne({ where: { id: applicantId } })
repository.findOneBy({ id: applicantId }) // New convenience method
repository.clear() // For completely emptying table
repository.createQueryBuilder().delete().execute() // For conditional deletes
repository.createQueryBuilder().update().set({ status: 'updated' }).execute()
repository.findBy({ id: In([id1, id2, id3]) })
```

### 3. CLI Command Changes ⚠️ **HIGH RISK**

**Issue**: TypeORM CLI has been completely redesigned

**Current Commands** (package.json):
```json
{
  "typeorm": "ts-node -r tsconfig-paths/register ../../node_modules/typeorm/cli.js --config src/ormconfig.ts"
}
```

**Required New Commands**:
```json
{
  "typeorm:migration:run": "typeorm-ts-node-commonjs migration:run -d src/data-source.ts",
  "typeorm:migration:revert": "typeorm-ts-node-commonjs migration:revert -d src/data-source.ts",
  "typeorm:migration:generate": "typeorm-ts-node-commonjs migration:generate src/migration/MigrationName -d src/data-source.ts",
  "typeorm:migration:create": "typeorm-ts-node-commonjs migration:create src/migration/MigrationName",
  "typeorm:schema:sync": "typeorm-ts-node-commonjs schema:sync -d src/data-source.ts",
  "typeorm:schema:drop": "typeorm-ts-node-commonjs schema:drop -d src/data-source.ts"
}
```

### 4. Import Changes ⚠️ **MEDIUM RISK**

**Issue**: Some TypeORM imports have been moved or renamed

**Current Imports** (across multiple files):
```typescript
import { getManager, In, IsNull, Repository } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
```

**Required Import Updates**:
```typescript
// getManager is deprecated - use DataSource instead
import { DataSource, In, IsNull, Repository } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm';
```

### 5. Migration File Compatibility ⚠️ **CRITICAL RISK**

**Issue**: 78+ migration files may need updates for TypeORM 0.3.x compatibility

**Migration Files to Review**:
- All files in `/apps/api/src/migration/` (78+ files from 2021-2025)
- Recent migrations that may use deprecated APIs
- Complex migrations with QueryRunner usage

**Potential Issues**:
- QueryRunner API changes
- Migration execution context changes
- Schema synchronization differences

## Detailed Upgrade Implementation Plan

### Phase 1: Pre-Upgrade Preparation (2 days)

#### Step 1.1: Environment Setup and Backup
1. **Create comprehensive database backup**:
   ```bash
   # Production backup (critical)
   pg_dump -h $POSTGRES_HOST -U $POSTGRES_USERNAME -d $POSTGRES_DATABASE > backup_pre_typeorm_upgrade.sql
   ```

2. **Document current database schema**:
   ```bash
   # Generate current schema documentation
   pg_dump -h $POSTGRES_HOST -U $POSTGRES_USERNAME -d $POSTGRES_DATABASE -s > current_schema.sql
   ```

3. **Test current migration state**:
   ```bash
   # Verify all migrations are applied
   make migration-show # Custom command to show migration status
   ```

#### Step 1.2: Dependency Compatibility Analysis
1. **Check @nestjs/typeorm compatibility**:
   - Verify version 10.x supports TypeORM 0.3.20
   - Review breaking changes in NestJS TypeORM integration
   - Test compatibility with current NestJS version

2. **Review entity relationship patterns**:
   - Document all entity relationships
   - Identify complex query patterns
   - Catalog custom repository methods

#### Step 1.3: Code Pattern Analysis
1. **Catalog all repository usage patterns**:
   ```bash
   # Find all repository method calls
   grep -r "findOne\|findByIds\|delete({})\|update({}" apps/api/src/
   ```

2. **Document critical query patterns**:
   - Complex QueryBuilder usage in services
   - Custom repository methods
   - Transaction usage patterns

### Phase 2: Development Environment Upgrade (1.5 days)

#### Step 2.1: Dependency Updates
1. **Update package.json**:
   ```json
   {
     "typeorm": "0.3.20",
     "@nestjs/typeorm": "^10.0.0",
     "typeorm-ts-node-commonjs": "^1.0.4"
   }
   ```

2. **Install new dependencies**:
   ```bash
   yarn install
   ```

#### Step 2.2: Configuration Migration
1. **Create new DataSource configuration**:

**File: `apps/api/src/data-source.ts`** (NEW FILE):
```typescript
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { DatabaseNamingStrategy } from './database/database.naming-strategy';
import DatabaseLogger from './database/database-logger';

// Import all entities
import { IENApplicant } from './applicant/entity/ienapplicant.entity';
import { IENApplicantAudit } from './applicant/entity/ienapplicant-audit.entity';
import { IENApplicantStatus } from './applicant/entity/ienapplicant-status.entity';
import { IENApplicantStatusAudit } from './applicant/entity/ienapplicant-status-audit.entity';
import { IENApplicantJob } from './applicant/entity/ienjob.entity';
import { IENUsers } from './applicant/entity/ienusers.entity';
// ... import all other entities

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +(process.env.PORTGRES_PORT || 5432),
  connectTimeoutMS: +(process.env.POSTGRES_TIMEOUT || 30000),
  username: process.env.POSTGRES_USERNAME || 'freshworks',
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE || 'ien',
  entities: [
    IENApplicant,
    IENApplicantAudit,
    IENApplicantStatus,
    // ... list all entities explicitly
  ],
  migrations: [__dirname + '/migration/*{.ts,.js}'],
  subscribers: [__dirname + '/**/*.subscriber{.ts,.js}'],
  synchronize: false,
  migrationsRun: true,
  namingStrategy: new DatabaseNamingStrategy(),
  logging: !!process.env.DEBUG,
  logger: process.env.DEBUG ? new DatabaseLogger() : undefined,
});

// Initialize DataSource for CLI usage
if (require.main === module) {
  AppDataSource.initialize()
    .then(() => {
      console.log('Data Source has been initialized successfully.');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization:', err);
    });
}
```

2. **Update database.module.ts**:
```typescript
import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from '../data-source';
// ... other imports

const getEnvironmentSpecificConfig = (env?: string) => {
  const baseConfig = AppDataSource.options;
  
  switch (env) {
    case 'production':
      return {
        ...baseConfig,
        entities: [join(__dirname, '../**/*.entity.js')],
        migrations: [join(__dirname, '../migration/*.js')],
      };
    case 'test':
      return {
        ...baseConfig,
        port: parseInt(process.env.TEST_POSTGRES_PORT || '5432'),
        host: process.env.TEST_POSTGRES_HOST,
        username: process.env.TEST_POSTGRES_USERNAME,
        password: process.env.TEST_POSTGRES_PASSWORD,
        database: process.env.TEST_POSTGRES_DATABASE,
        dropSchema: true,
      };
    default:
      return baseConfig;
  }
};

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...getEnvironmentSpecificConfig(process.env.NODE_ENV),
      autoLoadEntities: true,
    }),
  ],
  providers: [Logger],
})
export class DatabaseModule {}
```

3. **Update package.json scripts**:
```json
{
  "scripts": {
    "typeorm": "typeorm-ts-node-commonjs -d src/data-source.ts",
    "typeorm:migration:run": "typeorm-ts-node-commonjs migration:run -d src/data-source.ts",
    "typeorm:migration:revert": "typeorm-ts-node-commonjs migration:revert -d src/data-source.ts",
    "typeorm:migration:generate": "typeorm-ts-node-commonjs migration:generate -d src/data-source.ts",
    "typeorm:migration:create": "typeorm-ts-node-commonjs migration:create",
    "typeorm:schema:sync": "typeorm-ts-node-commonjs schema:sync -d src/data-source.ts"
  }
}
```

### Phase 3: Code Migration (2 days)

#### Step 3.1: Repository Method Updates

**High-Priority Files to Update**:

1. **`apps/api/src/applicant/ienapplicant.service.ts`**:
```typescript
// BEFORE:
async getApplicant(id: string): Promise<IENApplicant> {
  return this.ienapplicantRepository.findOne(id, {
    relations: ['status', 'jobs']
  });
}

// AFTER:
async getApplicant(id: string): Promise<IENApplicant> {
  return this.ienapplicantRepository.findOne({
    where: { id },
    relations: ['status', 'jobs']
  });
}

// OR use new convenience method:
async getApplicant(id: string): Promise<IENApplicant> {
  return this.ienapplicantRepository.findOneBy({ id });
}
```

2. **Mass Updates Required**:
```typescript
// Pattern 1: findOne with ID
// Find: \.findOne\(([^,{]+)\)
// Replace: .findOne({ where: { id: $1 } })

// Pattern 2: findOne with ID and options
// Find: \.findOne\(([^,]+),\s*({[^}]+})\)
// Replace: .findOne({ where: { id: $1 }, ...$2 })

// Pattern 3: Empty delete operations
// Find: \.delete\(\{\}\)
// Replace: .clear()

// Pattern 4: Empty update operations  
// Find: \.update\(\{\},\s*([^)]+)\)
// Replace: .createQueryBuilder().update().set($1).execute()

// Pattern 5: findByIds usage
// Find: \.findByIds\(([^)]+)\)
// Replace: .findBy({ id: In($1) })
```

#### Step 3.2: Import Statement Updates

**Files to Update** (across all service files):
```typescript
// BEFORE:
import { getManager, In, IsNull, Repository } from 'typeorm';

// AFTER:
import { DataSource, In, IsNull, Repository } from 'typeorm';

// Update getManager() usage:
// BEFORE:
const manager = getManager();

// AFTER:
constructor(private dataSource: DataSource) {}
// ...
const manager = this.dataSource.manager;
```

#### Step 3.3: Migration File Review

**Critical Migration Files to Test** (recent and complex ones):
1. `1737077728589-AddDeleteInfoAndBackupToIenApplicants.ts`
2. `1736304205932-UpdateApplicantStatusFromNCASToInspire.ts`
3. `1733414195778-AddSystemMilestoneRole.ts`
4. `1732043239738-UpdateWithdrawToNotProceedingStatus.ts`

**Migration Testing Process**:
```bash
# 1. Test migration compatibility
yarn typeorm:migration:run

# 2. Test migration rollback
yarn typeorm:migration:revert

# 3. Verify schema consistency
yarn typeorm:schema:sync --dry-run
```

### Phase 4: Testing & Validation (1.5 days)

#### Step 4.1: Unit Testing
```bash
# Test all services with repository usage
make api-unit-test

# Focus on critical service tests
yarn test --testPathPattern=ienapplicant.service.spec.ts
yarn test --testPathPattern=report.service.spec.ts
```

#### Step 4.2: Integration Testing
```bash
# Test database operations end-to-end
make api-integration-test

# Test migration operations
NODE_ENV=test yarn typeorm:migration:run
NODE_ENV=test yarn typeorm:migration:revert
```

#### Step 4.3: Critical Path Testing

**Manual Testing Checklist**:
- [ ] Applicant creation and retrieval
- [ ] Status updates and auditing
- [ ] Job application workflows
- [ ] Report generation
- [ ] User management operations
- [ ] Migration execution and rollback
- [ ] Database seeding (if applicable)

**Database Operation Testing**:
```sql
-- Verify critical queries still work
SELECT COUNT(*) FROM ien_applicants;
SELECT * FROM ien_applicant_status_audit LIMIT 10;
SELECT * FROM ien_jobs WHERE applicant_id IS NOT NULL LIMIT 10;

-- Test complex joins and relations
SELECT a.name, s.status, j.job_id 
FROM ien_applicants a 
LEFT JOIN ien_applicant_status s ON a.id = s.applicant_id 
LEFT JOIN ien_jobs j ON a.id = j.applicant_id 
LIMIT 10;
```

### Phase 5: Staging Environment Deployment (1 day)

#### Step 5.1: Staging Database Migration
1. **Create staging database backup**:
   ```bash
   pg_dump -h $STAGING_HOST -U $USERNAME -d $DATABASE > staging_backup_pre_upgrade.sql
   ```

2. **Deploy code changes to staging**
3. **Run migration validation**:
   ```bash
   # Dry run migrations
   yarn typeorm:schema:sync --dry-run
   
   # Run actual migrations
   yarn typeorm:migration:run
   ```

4. **Validate application functionality**

#### Step 5.2: Performance Testing
1. **Database query performance**:
   - Compare query execution times before/after
   - Monitor repository method performance
   - Check migration execution time

2. **Application response times**:
   - API endpoint response times
   - Report generation performance
   - User management operations

### Phase 6: Production Deployment (0.5 days)

#### Step 6.1: Final Pre-Deployment Checklist
- [ ] All tests passing in staging
- [ ] Database backup completed
- [ ] Rollback plan documented and tested
- [ ] Migration scripts validated
- [ ] Team notified of deployment window

#### Step 6.2: Production Deployment Steps
1. **Schedule maintenance window**
2. **Create production database backup**:
   ```bash
   pg_dump -h $PROD_HOST -U $USERNAME -d $DATABASE > production_backup_$(date +%Y%m%d_%H%M%S).sql
   ```
3. **Deploy application with new TypeORM version**
4. **Monitor application health and database performance**
5. **Validate critical workflows**

## Risk Mitigation Strategies

### Critical Risk Areas

#### 1. Migration Compatibility ⚠️ **CRITICAL**
**Risk**: 78+ migration files may not be compatible with TypeORM 0.3.x
**Mitigation**:
- Test all migrations in development environment
- Create automated migration test suite
- Document any migration files that need updates
- Have rollback plan for each migration

#### 2. Repository Method Changes ⚠️ **HIGH**
**Risk**: 120+ repository method usages may break
**Mitigation**:
- Systematic find-and-replace with verification
- Comprehensive unit testing of all repository methods
- Manual testing of critical data operations
- Code review of all repository-related changes

#### 3. Data Integrity ⚠️ **CRITICAL**
**Risk**: Database operations may corrupt or lose data
**Mitigation**:
- Comprehensive database backups before any changes
- Test all CRUD operations thoroughly
- Validate data consistency after migration
- Monitor database logs for errors

#### 4. Performance Degradation ⚠️ **MEDIUM**
**Risk**: New TypeORM version may have different performance characteristics
**Mitigation**:
- Benchmark critical queries before/after upgrade
- Monitor database performance post-deployment
- Have query optimization plan ready
- Performance testing in staging environment

### Rollback Plan

#### Quick Rollback Triggers
- Any migration fails to execute properly
- Data corruption or loss detected
- Critical application functionality breaks
- Significant performance degradation (>50% slower)
- Unable to resolve compatibility issues within 4 hours

#### Rollback Procedure
1. **Immediate Response**:
   ```bash
   # Stop application
   kubectl scale deployment ien-api --replicas=0
   
   # Restore database backup
   psql -h $PROD_HOST -U $USERNAME -d $DATABASE < production_backup_TIMESTAMP.sql
   ```

2. **Code Rollback**:
   ```bash
   # Revert to previous version
   git revert HEAD~1
   
   # Redeploy previous version
   # Update package.json
   "typeorm": "0.2.45",
   "@nestjs/typeorm": "8.0.2"
   
   yarn install
   ```

3. **Verification**:
   - Test critical application functionality
   - Verify data integrity
   - Monitor application health
   - Notify stakeholders of rollback completion

#### Partial Rollback Strategy
If some functionality works but others don't:
1. **Identify working vs broken components**
2. **Isolate problematic code sections**
3. **Apply targeted fixes or rollbacks**
4. **Maintain system availability where possible**

## Success Criteria

### Technical Success Metrics
- [ ] All 78+ migrations execute successfully
- [ ] Zero data loss or corruption
- [ ] All unit tests pass (>95% success rate)
- [ ] All integration tests pass (>90% success rate)
- [ ] Repository methods work correctly (100% of CRUD operations)
- [ ] Query performance within 10% of baseline
- [ ] No TypeORM-related runtime errors

### Business Success Metrics
- [ ] No user-facing functionality breaks
- [ ] No increase in error rates (APIs, database operations)
- [ ] No performance degradation for end users
- [ ] All critical workflows function correctly:
  - Applicant management
  - Status tracking
  - Report generation
  - User administration

### Operational Success Metrics
- [ ] Deployment completes within maintenance window
- [ ] Database migrations complete successfully
- [ ] No emergency rollbacks required
- [ ] Monitoring shows stable system performance
- [ ] Support tickets related to upgrade < 5 within 48 hours

## Timeline & Resource Allocation

### Development Phase (5 days)
- **Phase 1** (Preparation): 2 days - Senior developer + DBA
- **Phase 2** (Development): 1.5 days - Senior developer
- **Phase 3** (Code Migration): 2 days - Senior developer + Junior developer
- **Phase 4** (Testing): 1.5 days - QA engineer + Developer

### Deployment Phase (1.5 days)
- **Phase 5** (Staging): 1 day - DevOps + Developer
- **Phase 6** (Production): 0.5 day - DevOps + Senior developer + DBA

**Total Estimated Time**: 6.5 days
**Team Required**: Senior developer, Junior developer, QA engineer, DevOps engineer, DBA

## Alternative Recommendations

### Option 1: Stay on TypeORM 0.2.x (Recommended)
**Pros**:
- No risk of breaking existing functionality
- No migration complexity
- Stable and well-tested codebase
- Focus development efforts on business features

**Cons**:
- Missing new TypeORM 0.3.x features
- Potential security vulnerabilities in older version
- Technical debt accumulation

### Option 2: Gradual Migration Approach
**Phase 1**: Upgrade to TypeORM 0.2.50 (latest 0.2.x)
**Phase 2**: Prepare codebase for 0.3.x compatibility
**Phase 3**: Upgrade to TypeORM 0.3.x when ready

### Option 3: Full Rewrite Consideration
For future consideration: Evaluate alternative ORMs or database access patterns:
- Prisma ORM
- Native SQL with query builders
- MikroORM

## Conclusion & Final Recommendation

**⚠️ HIGH RISK UPGRADE - PROCEED WITH CAUTION**

This TypeORM upgrade involves:
- **78+ database migrations** that need compatibility verification
- **120+ repository method calls** requiring updates
- **Critical production data** at risk during migration
- **Complex NestJS integration** changes required

### Final Recommendation: **POSTPONE UPGRADE**

**Reasons**:
1. **High complexity with limited business value**
2. **Significant risk to production data and stability**
3. **Large time investment** (6.5 days) with uncertain outcomes
4. **Current system is stable** and meeting business requirements

### Alternative Action Plan:
1. **Monitor TypeORM 0.2.x** for security updates
2. **Plan upgrade** for future quarter with dedicated migration sprint
3. **Focus current efforts** on business feature development
4. **Research migration tools** and automation strategies
5. **Consider alternative database patterns** for new features

If upgrade becomes necessary due to security or feature requirements, follow this detailed plan with **extensive testing** and **comprehensive backup strategies**.