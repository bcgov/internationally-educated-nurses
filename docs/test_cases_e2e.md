# IEN Application - E2E Test Cases Documentation

## Document Overview
This document outlines E2E test cases for the Internationally Educated Nurses (IEN) application. This is designed to serve as a reference for QA and developers to ensure test coverage and CI validation.

---

## 1. Authentication & Authorization

### Test Suite: Login

#### TC-1.1: Login with Admin User Account
**Objective:** Verify that an admin user can successfully log in to the system  
**Preconditions:** 
- Application is accessible
- Valid admin credentials are available

**Test Steps:**
1. Navigate to the application home page
2. Click the "Login" button
3. If prompted, select "Login with Keycloak"
4. Enter admin username credentials
5. Enter password
6. Click "Login" button

**Expected Results:**
- User is successfully authenticated
- User is redirected to the main applicants page
- Username is displayed in the header

---

#### TC-1.2: Login with HMBC User Account
**Objective:** Verify that an HMBC user can successfully log in to the system  
**Preconditions:**
- Application is accessible
- Valid HMBC user credentials are available

**Test Steps:**
1. Navigate to the application home page
2. Click the "Login" button
3. If prompted, select "Login with Keycloak"
4. Enter HMBC username (ien_hmbc)
5. Enter password
6. Click "Login" button

**Expected Results:**
- User is successfully authenticated
- User is redirected to their authorized view
- Username is displayed in the header

---

## 2. Applicant Management

### Test Suite: Search Functionality

#### TC-2.1: Search Applicants by Name
**Objective:** Verify that users can search for applicants using the search bar  
**Preconditions:**
- User is logged in with appropriate permissions
- Test applicants exist in the system

**Test Steps:**
1. Navigate to "Manage Applicants" page
2. Locate the search input field
3. Enter an applicant's name in the search bar
4. Wait for search results to appear

**Expected Results:**
- System displays matching applicants in a dropdown
- Each result shows the applicant name
- Clicking a result navigates to the applicant's detail page
- Search bar can be cleared to start a new search

---

### Test Suite: Filter Applicants

#### TC-2.2: Filter Applicants by Category Tabs
**Objective:** Verify that applicants can be filtered by process category  
**Preconditions:**
- User is logged in
- Applicants exist in different process categories

**Test Steps:**
1. Navigate to "Manage Applicants" page
2. Verify "All" tab shows all applicants
3. Click "Licensing/Registration" tab
4. Click "Recruitment" tab
5. Click "BC PNP" tab
6. Return to "All" tab

**Expected Results:**
- "Licensing/Registration" tab shows applicants in licensing process (or shows empty state)
- "Recruitment" tab shows applicants in recruitment process
- "BC PNP" tab shows BC PNP applicants (or shows empty state)
- "All" tab displays all applicants with "Details" links visible

---

## 3. Applicant Details

### Test Suite: Milestone Management

#### TC-3.1: Add a New Milestone
**Objective:** Verify that authorized users can add milestones to an applicant's record  
**Preconditions:**
- User is logged in with edit permissions
- Applicant record exists
- User is on applicant details page

**Test Steps:**
1. Navigate to applicant details page
2. Select "Recruitment" tab
3. Click on the first job record
4. Click "Add Milestone" or similar button
5. Select milestone type from dropdown
6. Select outcome/status
7. Enter notes
8. Select or enter start date
9. Click "Save" or "Create"

**Expected Results:**
- New milestone is added to the applicant's record
- Milestone appears in the milestone list with correct details
- Success message is displayed
- Timeline is updated

---

#### TC-3.2: Edit an Existing Milestone
**Objective:** Verify that users can update milestone information  
**Preconditions:**
- User is logged in with edit permissions
- Milestone exists on applicant record

**Test Steps:**
1. Navigate to applicant details page
2. Select "Recruitment" tab
3. Click on a job record with milestones
4. Click the edit icon on a milestone
5. Update milestone type
6. Update outcome/status
7. Update notes
8. Update start date
9. Click "Save Changes"

**Expected Results:**
- Milestone is updated with new information
- Changes are reflected immediately in the UI
- Updated outcome is visible
- Updated date is displayed in correct format (MMM DD, YYYY)
- Updated notes are visible

---

#### TC-3.3: Delete a Milestone
**Objective:** Verify that users can remove milestones from an applicant's record  
**Preconditions:**
- User is logged in with delete permissions
- Multiple milestones exist on applicant record

**Test Steps:**
1. Navigate to applicant details page
2. Select "Recruitment" tab
3. Click on a job record
4. Note the number of existing milestones
5. Click delete button on a milestone
6. Confirm deletion if prompted

**Expected Results:**
- Milestone is removed from the record
- Number of visible milestones decreases by one
- No error messages appear
- Timeline is updated to reflect removal

---

#### TC-3.4: Filter Milestones by Category
**Objective:** Verify that milestones can be filtered by process category  
**Preconditions:**
- User is logged in
- Applicant has milestones in different categories

**Test Steps:**
1. Navigate to applicant details page
2. Click "Licensing/Registration" tab
3. Observe milestone records
4. Click "Recruitment" tab
5. Observe milestone records
6. Click "BC PNP" tab
7. Observe milestone records

**Expected Results:**
- Each tab shows only milestones relevant to that category
- "Licensing/Registration" may show no records if none exist
- "Recruitment" shows recruitment-related milestones
- "BC PNP" may show no records if none exist

---

### Test Suite: Job Competition Management

#### TC-3.5: Add a Job Record
**Objective:** Verify that users can add job competition records for applicants  
**Preconditions:**
- User is logged in with edit permissions
- Applicant details page is open

**Test Steps:**
1. Navigate to applicant details page
2. Select "Recruitment" tab
3. Click "Add Record" button
4. Select Health Authority/PCN
5. Enter Job ID
6. Select at least one community (mandatory)
7. Fill in other job details
8. Click "Create" button

**Expected Results:**
- New job record is added to the applicant
- Job count increases (e.g., "7 items")
- New record appears in the job list
- Success message is displayed

---

#### TC-3.6: Validate Mandatory Communities Field
**Objective:** Verify that the system enforces mandatory community selection  
**Preconditions:**
- User is on applicant details page
- Add Job form is open

**Test Steps:**
1. Click "Add Record" button
2. Select Health Authority/PCN
3. Enter Job ID
4. Leave communities field empty
5. Click "Create" button

**Expected Results:**
- Validation error message appears: "At least one community is required"
- Form is not submitted
- User can click "Cancel" to close the form
- No job record is created

---

#### TC-3.7: Reject Duplicate Job Record
**Objective:** Verify that the system prevents duplicate job records  
**Preconditions:**
- User is logged in
- A job record already exists with specific HA and Job ID

**Test Steps:**
1. Navigate to applicant details page
2. Attempt to add a job record with same HA and Job ID as existing record
3. Fill all required fields
4. Click "Create"

**Expected Results:**
- System detects duplicate
- Error message is displayed
- Job record is not created
- Existing job count remains unchanged

---

#### TC-3.8: Edit Job Competition Details
**Objective:** Verify that users can update job competition information  
**Preconditions:**
- User has edit permissions
- Job record exists on applicant

**Test Steps:**
1. Navigate to applicant details page
2. Click on the first job record to expand
3. Click "Edit Details" button
4. Modify job fields (HA, communities, job title, etc.)
5. Click "Save" or similar button

**Expected Results:**
- Job details are updated successfully
- Changes are reflected in the job record
- No duplicate validation errors occur (unless trying to create duplicate)
- Success message is displayed

---

#### TC-3.9: Close Job Competition by Withdraw
**Objective:** Verify that job competitions can be closed with "withdraw" milestone  
**Preconditions:**
- User is logged in
- Active job competition exists

**Test Steps:**
1. Navigate to applicant details page
2. Click on the first job record
3. Add a withdrawal milestone
4. Select appropriate outcome
5. Save the milestone

**Expected Results:**
- Job status changes to "Complete - [Withdrawal Outcome]"
- Job is marked as closed
- Withdrawal milestone is added to timeline
- Job can no longer be edited in certain ways

---

#### TC-3.10: Reopen a Job Competition
**Objective:** Verify that closed job competitions can be reopened  
**Preconditions:**
- User is logged in
- Job competition is closed/complete

**Test Steps:**
1. Navigate to applicant details page
2. Click on a closed job record
3. Add a "reopen" milestone
4. Select appropriate outcome
5. Save the milestone

**Expected Results:**
- Job status changes to "On Going - [Reopen Outcome]"
- Job is marked as active again
- Reopen milestone is added to timeline
- Job can be edited again

---

#### TC-3.11: Close Job Competition by Accepting Offer
**Objective:** Verify that job competitions can be closed when offer is accepted  
**Preconditions:**
- User is logged in
- Active job competition exists

**Test Steps:**
1. Navigate to applicant details page
2. Click on the first job record
3. Add an "accept offer" milestone
4. Select appropriate outcome
5. Save the milestone
6. Optionally clean up by deleting test milestones

**Expected Results:**
- Job status changes to "Complete - [Accept Offer Outcome]"
- Job is marked as successfully closed
- Accept offer milestone is added to timeline
- This represents successful recruitment completion

---

#### TC-3.12: Filter Jobs by Health Authority
**Objective:** Verify that job records can be filtered by Health Authority  
**Preconditions:**
- User is logged in
- Multiple job records exist with different HAs

**Test Steps:**
1. Navigate to applicant details page
2. Locate HA filter dropdown
3. Select one or more Health Authorities
4. Observe filtered results

**Expected Results:**
- Only jobs matching selected HAs are displayed
- Job count reflects filtered results
- All visible jobs show the selected HA
- Filter can be cleared to show all jobs

---

#### TC-3.13: Filter Jobs by Specialty
**Objective:** Verify that job records can be filtered by job specialty/title  
**Preconditions:**
- User is logged in
- Multiple job records exist with different specialties

**Test Steps:**
1. Navigate to applicant details page
2. Locate specialty filter dropdown
3. Select a job specialty/title
4. Observe filtered results

**Expected Results:**
- Only jobs matching selected specialty are displayed
- Job count reflects filtered results
- All visible jobs show the selected specialty

---

#### TC-3.14: Filter Jobs by Multiple Criteria
**Objective:** Verify that multiple filters can be applied simultaneously  
**Preconditions:**
- User is logged in
- Multiple job records exist

**Test Steps:**
1. Navigate to applicant details page
2. Select Health Authority filter
3. Select specialty filter
4. Observe filtered results
5. Click "Clear" button

**Expected Results:**
- Only jobs matching ALL filter criteria are displayed
- Job count reflects combined filters
- "Clear" button removes all filters
- Default view shows first 5 jobs (if more than 5 exist)

---

## 4. Reporting

### Test Suite: Standard Reports

#### TC-4.1: Access Reporting Page
**Objective:** Verify that authorized users can access the reporting section  
**Preconditions:**
- User is logged in with reporting permissions

**Test Steps:**
1. Log in to the application
2. Click "Reporting" link in navigation

**Expected Results:**
- User is redirected to the reporting page
- Page displays "Reporting" heading
- Report options are visible

---

### Test Suite: Data Extract

#### TC-4.2: Download Applicant Data Extract (HMBC User)
**Objective:** Verify that HMBC users can download applicant data extract  
**Preconditions:**
- User is logged in as HMBC user (ien_hmbc)
- Applicant data exists in the system

**Test Steps:**
1. Navigate to Reporting page
2. Locate "Data Extract" section
3. Verify form inputs are enabled
4. Enter "From" date (e.g., 2020-01-01)
5. Enter "To" date (e.g., yesterday's date)
6. Select "Applicants" option
7. Click "Download" button (should be enabled)
8. Wait for file download

**Expected Results:**
- Form fields accept date input
- Download button becomes enabled after valid dates entered
- File downloads successfully
- File name format: `ien-applicants-data-extract_[from]-[to].xlsx`
- Excel file contains sheets: "Rows as Users", "Legend"
- Data is properly formatted in Excel

---

#### TC-4.3: Download Milestone Data Extract (MOH User)
**Objective:** Verify that MOH users can download milestone data extract  
**Preconditions:**
- User is logged in as MOH user (ien_moh)
- Milestone data exists in the system

**Test Steps:**
1. Navigate to Reporting page
2. Locate "Data Extract" section
3. Verify form inputs are enabled
4. Enter "From" date (e.g., 2020-01-01)
5. Enter "To" date (e.g., yesterday's date)
6. Select "Milestones" option
7. Click "Download" button (should be enabled)
8. Wait for file download

**Expected Results:**
- Form fields accept date input
- Download button becomes enabled after valid dates entered
- File downloads successfully
- File name format: `ien-milestones-data-extract_[from]-[to].xlsx`
- Excel file contains sheets: "Rows as Milestones", "Legend"
- Data is properly formatted in Excel

---

## 5. User Management

### Test Suite: User Search and Filter

#### TC-5.1: Search Users by Name
**Objective:** Verify that users can search for other users in user management  
**Preconditions:**
- User is logged in with user management permissions
- Multiple users exist in the system

**Test Steps:**
1. Navigate to User Management page
2. Locate user search input
3. Enter search term (e.g., "ien")
4. Observe filtered results

**Expected Results:**
- User list filters to show matching users
- Search is case-insensitive
- Results update as user types
- All matching users are displayed

---

#### TC-5.2: Filter Users by Role
**Objective:** Verify that users can be filtered by their assigned roles  
**Preconditions:**
- User is logged in with user management permissions
- Users with different roles exist

**Test Steps:**
1. Navigate to User Management page
2. Use role filter to select "Provisioner"
3. Clear filter
4. Select "Manage Applicants" role
5. Clear filter
6. Select "Reporting" role
7. Clear filter
8. Select multiple roles: "Provisioner" and "Reporting"
9. Optionally filter by revocation status

**Expected Results:**
- Each filter shows only users with selected role(s)
- Multiple role selection works (AND/OR logic)
- Filter can be cleared to show all users
- Revocation filter works in combination with role filters

---

#### TC-5.3: User Management Pagination
**Objective:** Verify that user list pagination works correctly  
**Preconditions:**
- User is logged in
- More users exist than can fit on one page

**Test Steps:**
1. Navigate to User Management page
2. Observe pagination controls
3. Click "Next" page
4. Click "Previous" page
5. Try different page numbers

**Expected Results:**
- Pagination controls are visible
- Page navigation works correctly
- User count is accurate
- Page size is consistent

---

### Test Suite: User Role Management

#### TC-5.4: Change User Role
**Objective:** Verify that administrators can modify user roles  
**Preconditions:**
- User is logged in with admin/provisioner permissions
- Target user exists (e.g., ien_moh)

**Test Steps:**
1. Navigate to User Management page
2. Click on target user (ien_moh) to view details
3. Locate "Provisioner" role toggle
4. Click toggle to enable role (should show checked state)
5. Click toggle to disable role (should show unchecked state)

**Expected Results:**
- Role toggle changes state when clicked
- Role assignment is saved immediately
- Visual indicator (checked/unchecked) updates correctly
- User's permissions are updated in system

---

#### TC-5.5: Revoke User Access
**Objective:** Verify that administrators can revoke user access to the system  
**Preconditions:**
- User is logged in with admin/provisioner permissions
- Target user has active access

**Test Steps:**
1. Navigate to User Management page
2. Click on target user to view details
3. Verify "Remove access" button is visible
4. Click "Remove access" button
5. Confirm action if prompted

**Expected Results:**
- User access is revoked
- Button text changes to "Grant access"
- User can no longer log in to system
- User appears as revoked in user list

---

#### TC-5.6: Deny Access to Revoked User
**Objective:** Verify that revoked users cannot access the application  
**Preconditions:**
- User account has been revoked (e.g., ien_moh)

**Test Steps:**
1. Log in with revoked user credentials
2. Attempt to access home page

**Expected Results:**
- User successfully authenticates with credentials
- User sees authorization error message
- Message displays: "You are not authorized to use"
- User cannot access any application features

---

#### TC-5.7: Activate a Revoked User
**Objective:** Verify that revoked users can be reactivated  
**Preconditions:**
- User is logged in with admin/provisioner permissions
- Target user is currently revoked

**Test Steps:**
1. Navigate to User Management page
2. Click on revoked user to view details
3. Verify "Grant access" button is visible
4. Click "Grant access" button
5. Confirm action if prompted

**Expected Results:**
- User access is restored
- Button text changes back to "Remove access"
- User can now log in to system
- User appears as active in user list

---

### Test Suite: Permission-Based Access

#### TC-5.8: Read-Only Access to Applicants
**Objective:** Verify that users with read-only permissions cannot edit applicant data  
**Preconditions:**
- User is logged in with view-only permissions (ien_e2e_view)
- Applicant records exist

**Test Steps:**
1. Navigate to Manage Applicants page
2. Verify "Add Applicant" button visibility
3. Navigate to applicant details page
4. Check for "Add Record" button
5. Click on a job record
6. Check for "Edit Details" button
7. Check for edit milestone icons
8. Check for delete milestone icons

**Expected Results:**
- "Add Applicant" button does not exist
- "Add Record" button does not exist
- "Edit Details" button does not exist
- Edit milestone icons are not visible
- Delete milestone icons are not visible
- User can only view information, not modify it

---

## 6. Health Authority (HA) Specific Features

### Test Suite: HA User Restrictions

#### TC-6.1: Filter Applicants by HA Assignment
**Objective:** Verify that HA users only see applicants assigned to their authority  
**Preconditions:**
- User is logged in as HA user (e.g., ien_fha)
- Applicants belong to different health authorities

**Test Steps:**
1. Navigate to Manage Applicants page
2. Verify page count/total applicants visible
3. Search for an applicant from a different HA (e.g., "Rousseau")

**Expected Results:**
- User sees fewer total pages (e.g., "of 6 pages")
- Only applicants from user's HA are visible
- Search for other HA applicants returns no results
- Applicants from other authorities are filtered out

---

#### TC-6.2: Cross-HA User Visibility
**Objective:** Verify that HA users can view applicants assigned to colleagues in same HA  
**Preconditions:**
- Multiple users in same HA (e.g., ien_fha, ien_fha2)
- Applicant is assigned to one HA user

**Test Steps:**
1. Log in as second HA user (ien_fha2)
2. Navigate to Manage Applicants page
3. Search for applicant assigned to first user (e.g., "Gabriel Lockman")

**Expected Results:**
- User can see applicants assigned to colleagues
- Applicant details are accessible
- Full information is visible
- Collaboration within HA is supported

---

#### TC-6.3: Filter HA Users in User Management
**Objective:** Verify that HA users only see users from their own authority  
**Preconditions:**
- User is logged in as HA user (e.g., ien_viha)
- Users exist in multiple health authorities

**Test Steps:**
1. Navigate to User Management page
2. Observe user list

**Expected Results:**
- Only users from same HA are visible
- User table shows limited number of users (e.g., 1 user)
- Users from other HAs are filtered out
- HA-specific user isolation is maintained

---

### Test Suite: Assign to Me Feature

#### TC-6.4: Assign Applicant to HA User
**Objective:** Verify that HA users can assign applicants to themselves  
**Preconditions:**
- User is logged in as HA user (ien_fha)
- Unassigned or differently assigned applicants exist

**Test Steps:**
1. Navigate to applicant details (e.g., Gabriel Lockman)
2. Click "Assign to me" button
3. Verify assignment in recruiter field
4. Navigate to another applicant (e.g., Trudie Grimes)
5. Click "Assign to me" button
6. Verify assignment

**Expected Results:**
- "Assign to me" button is visible and clickable
- Applicant is assigned to current user
- Recruiter field displays username (ien_fha)
- Assignment persists across page refreshes

---

#### TC-6.5: Assign Applicant Across Different HAs
**Objective:** Verify that applicants can be assigned to users from different HAs  
**Preconditions:**
- User is logged in as different HA user (ien_viha)
- Applicant exists

**Test Steps:**
1. Navigate to applicant details (e.g., Gabriel Lockman)
2. Click "Assign to me" button

**Expected Results:**
- Applicant is assigned to current user (ien_viha)
- Previous assignment is updated
- Recruiter field displays new username
- Applicant remains visible to users in both HAs

---

#### TC-6.6: Hide "Assign to Me" for Non-HA Users
**Objective:** Verify that non-HA users do not see assignment features  
**Preconditions:**
- User is logged in as non-HA user (admin/moh user)
- Applicant details page is open

**Test Steps:**
1. Navigate to applicant details
2. Check for "Assign to me" button
3. Check for recruiter field

**Expected Results:**
- "Assign to me" button does not exist
- Recruiter field is not visible
- Assignment features are hidden from non-HA users
- Other functionality remains accessible

---

### Test Suite: Active/Inactive Applicant Management

#### TC-6.7: Hide Active Applicant (Make Inactive)
**Objective:** Verify that HA users can hide applicants from their active list  
**Preconditions:**
- User is logged in as HA user (ien_fha)
- Active applicant exists

**Test Steps:**
1. Navigate to applicant details (Gabriel Lockman)
2. Verify active status text shows "Applicant is Visible"
3. Click the active toggle button
4. Observe status change

**Expected Results:**
- Status text changes to "Applicant is Hidden"
- Toggle state changes to inactive
- Applicant becomes hidden in default applicant list
- Change is saved immediately

---

#### TC-6.8: HA-Specific Inactive Status
**Objective:** Verify that inactive status in one HA doesn't affect other HAs  
**Preconditions:**
- Applicant is hidden by one HA user (ien_fha)
- Different HA user exists (ien_viha)

**Test Steps:**
1. Log in as different HA user (ien_viha)
2. Navigate to same applicant details (Gabriel Lockman)
3. Check active status

**Expected Results:**
- Status shows "Applicant is Visible"
- Applicant appears in active list for other HA
- Inactive status is HA-specific, not global
- Each HA manages visibility independently

---

#### TC-6.9: Toggle Show/Hide Inactive Applicants
**Objective:** Verify that HA users can toggle visibility of hidden applicants  
**Preconditions:**
- User is logged in as HA user (ien_fha)
- At least one applicant is hidden

**Test Steps:**
1. Navigate to Manage Applicants page
2. Note number of visible applicants (e.g., 1)
3. Click "Hide inactive applicants" toggle
4. Note number of visible applicants (e.g., 2)
5. Click toggle again

**Expected Results:**
- Default view shows only active applicants (e.g., 1)
- Toggle ON shows both active and inactive (e.g., 2)
- Toggle OFF returns to active only view (e.g., 1)
- Toggle state persists during session

---

#### TC-6.10: Reactivate Inactive Applicant
**Objective:** Verify that hidden applicants can be made visible again  
**Preconditions:**
- User is logged in as HA user (ien_fha)
- Applicant is currently hidden

**Test Steps:**
1. Navigate to Manage Applicants page (with inactive shown)
2. Navigate to hidden applicant details (Gabriel Lockman)
3. Verify status shows "Applicant is Hidden"
4. Click active toggle button

**Expected Results:**
- Status text changes to "Applicant is Visible"
- Applicant appears in default active list
- Toggle state changes to active
- Change is saved immediately

---

## 7. Administrative Functions

### Test Suite: BCCNM/NCAS Data Updates

#### TC-7.1: Validate BCCNM/NCAS Upload File
**Objective:** Verify that system validates uploaded BCCNM/NCAS data files  
**Preconditions:**
- User is logged in with admin permissions
- Test Excel file with validation scenarios exists

**Test Steps:**
1. Navigate to Admin page
2. Click "Upload" button
3. Select file: `bccnm-ncas-creates.xlsx`
4. Click file upload confirmation
5. Review validation results

**Expected Results:**
- File uploads successfully
- Filename is displayed (bccnm-ncas-creates.xlsx)
- Summary shows: "All (5)", "No changes (1)", "Valid (2)"
- Three error messages displayed in red
- Validation messages include:
  - "Invalid country code"
  - "Applicant not found"
  - "No changes"
- "Cancel" and "Apply" buttons are visible
- Invalid records are clearly marked

---

#### TC-7.2: Create BCCNM Milestones from Upload
**Objective:** Verify that valid records create "Signed Return of Service Agreement" milestones  
**Preconditions:**
- User is logged in with admin permissions
- Valid BCCNM/NCAS data file exists

**Test Steps:**
1. Navigate to Admin page
2. Click "Upload" button
3. Select file: `bccnm-ncas-creates.xlsx`
4. Click file upload confirmation
5. Review validation (should show valid records)
6. Click "Apply" button

**Expected Results:**
- System processes valid records
- Success message: "2 applicants updated"
- New milestones are created for valid applicants
- Milestone type: "Signed Return of Service Agreement"
- Invalid records are skipped
- No errors for valid records

---

#### TC-7.3: Update Existing BCCNM Milestones
**Objective:** Verify that existing BCCNM milestones can be updated  
**Preconditions:**
- User is logged in with admin permissions
- BCCNM milestones already exist for applicants
- Update file exists

**Test Steps:**
1. Navigate to Admin page
2. Click "Upload" button
3. Select file: `bccnm-ncas-updates.xlsx`
4. Click file upload confirmation
5. Review validation

**Expected Results:**
- Validation shows: "All (2)", "Valid (2)"
- No error messages for valid updates
- Click "Apply" processes updates
- Success message: "2 applicants updated"
- Existing milestones are updated with new data
- No duplicate milestones are created

---

#### TC-7.4: Ignore Duplicate BCCNM Updates
**Objective:** Verify that system ignores updates with same date (no changes)  
**Preconditions:**
- User is logged in with admin permissions
- Previous update has been applied
- Same update file is used again

**Test Steps:**
1. Navigate to Admin page
2. Click "Upload" button
3. Select same file: `bccnm-ncas-updates.xlsx`
4. Click file upload confirmation
5. Review validation results

**Expected Results:**
- Validation shows: "All (2)", "No changes (2)"
- All records marked as "No changes"
- "Apply" button is disabled
- No updates are processed
- System prevents duplicate/redundant updates
- User can cancel and upload different file
