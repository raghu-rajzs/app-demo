# Unified Field Assistant - User Manual

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Navigation Overview](#navigation-overview)
4. [Analytics Tab](#analytics-tab)
5. [Field Tracker Tab](#field-tracker-tab)
6. [Grower Profiles Tab](#grower-profiles-tab)
7. [Advisory Tasks Tab](#advisory-tasks-tab)
8. [Common Workflows](#common-workflows)
9. [Tips & Best Practices](#tips--best-practices)
10. [Troubleshooting](#troubleshooting)
11. [Quick Reference](#quick-reference)

---

## Introduction

Welcome to the **Unified Field Assistant**! This mobile-first agricultural management application helps you track fields, manage growers, monitor crop health, and complete advisory tasks efficiently.

### Key Features

- Real-time field analytics and KPI tracking
- Interactive field mapping with geo-location
- Comprehensive grower database management
- Task-based advisory system with remarks
- Mobile-optimized for field use (iPhone 16 resolution)

---

## Getting Started

### First Launch

When you first open the app, you'll land on the **Analytics** tab showing an overview of your agricultural operations.

### Screen Layout

- **Top Bar**: Shows the current tab name and description
- **Main Content Area**: Displays tab-specific content
- **Bottom Navigation**: 4 main tabs for quick access

---

## Navigation Overview

The app features **4 main tabs** accessible from the bottom navigation bar:

| Tab                | Icon | Purpose                                    |
| ------------------ | ---- | ------------------------------------------ |
| **Analytics**      | 📊   | View KPIs, charts, and performance metrics |
| **Fields**         | 🗺️   | Manage and track agricultural fields       |
| **Growers**        | 👥   | Browse and manage grower profiles          |
| **Advisory Tasks** | 📋   | View and complete field advisory tasks     |

**Tip**: Tap any tab icon to switch between sections instantly.

---

## Analytics Tab

### Overview

The Analytics tab provides a high-level dashboard of your agricultural operations.

### Key Performance Indicators (KPIs)

The dashboard displays 8 essential KPIs:

1. **Total Growers** (👥)
   - Total number of registered growers in the system
   - Tap to view grower list (if linked)

2. **Total Yield (Tons)** (📦)
   - Cumulative yield across all fields
   - Measured in metric tons

3. **Total Fields** (🗺️)
   - Total number of registered agricultural fields
   - **Tap to navigate to Field Tracker showing all fields**

4. **Fields Pending Audit** (⚠️)
   - Number of fields awaiting field verification
   - **Tap to navigate to Field Tracker filtered by pending fields**

5. **Fields Audited** (✅)
   - Number of verified and audited fields
   - **Tap to navigate to Field Tracker filtered by audited fields**

6. **Total Tasks** (📋)
   - All advisory tasks in the system

7. **Overdue Tasks** (⚠️ Red)
   - Critical tasks past their due date
   - **Tap to navigate to Advisory Tasks filtered by overdue**

8. **Pending Tasks** (🕒)
   - Tasks awaiting completion
   - **Tap to navigate to Advisory Tasks filtered by pending**

### Interactive Features

- **Tap any KPI card** with navigation enabled to drill down into details
- **Pull down to refresh** data (when implemented)
- **Color coding**: Green = positive/complete, Red = urgent, Amber = pending, Blue = informational

---

## Field Tracker Tab

### Overview

The Field Tracker helps you visualize, search, and manage all agricultural fields in your territory.

### View Modes

#### 1. Map View (Default)

- **Visual map display** showing field locations
- **Custom agricultural background** with field imagery
- **Square/rectangular field markers** representing different fields
- **Tap any field marker** to view detailed information

**Map Features**:

- Zoom and pan to navigate
- Visual field boundaries
- Quick identification of field locations

#### 2. List View

Toggle to list view using the view switcher at the top.

**Each field card shows**:

- **Field ID**: Hierarchical format (State/City/Village/GrowerInitials/Number)
  - Example: `PB/AMRITSAR/RAMPUR/RK/01`
- **Grower Name**: Owner of the field
- **Crop Type**: 🌱 Current crop (Corn, Rice, or Cotton)
- **Hybrid**: Variety/hybrid in parentheses
- **Sowing Date**: When the crop was planted (e.g., "Jun 15, 2024")
- **Audit Status**: Badge showing "Audited" ✅ or "Audit Pending"

### Search & Filter

#### Search Bar

- Located at the top of the screen
- Search by: Field ID, Grower Name, Village, or Crop
- Real-time filtering as you type

#### Filter Options

Tap the **Filter** icon (⚙️) to access:

**Filter by Crop**:

- ☑️ Corn
- ☑️ Rice
- ☑️ Cotton

**Filter by Status**:

- ☑️ Healthy
- ☑️ Mild Stress
- ☑️ Moderate Stress
- ☑️ Severe Stress

**Filter by Audit Status**:

- ☑️ Audited
- ☑️ Pending Audit

**Actions**:

- **Clear All**: Remove all filters
- **Apply**: Apply selected filters

### Adding a New Field

1. Tap the **+ (Plus)** button in the top-right corner
2. Choose one of three methods:

#### Method 1: Manual Entry

- Fill in field details step-by-step
- Enter field location, grower info, crop details
- Set geo-boundaries manually

#### Method 2: Copy from Existing Grower

- Select an existing grower
- Plot details pre-fill with grower information
- Modify as needed
- Quick way to add multiple fields for the same grower

#### Method 3: Create New Grower

- Add both grower and field simultaneously
- Complete grower profile first
- Then add field details
- Ideal for onboarding new growers

### Field Details View

When you tap a field card, you see:

**Field Information**:

- Full Field ID
- Grower details
- Acreage
- Crop and hybrid
- Sowing date
- Current status

**Field Actions** (⋮ menu):

- **Edit**: Modify field details
- **Copy**: Duplicate field with new ID
- **Share**: Share field information
- **Delete**: Remove field from system

**Health Metrics**:

- Soil moisture level
- Water lodging status
- Heat stress indicators
- Pest observations
- Disease observations

**Location**:

- Village name
- Geographic coordinates
- Map view of plot boundary

**Associated Tasks**:

- List of pending/completed tasks for this field
- Quick access to task completion

---

## Grower Profiles Tab

### Overview

Manage your database of growers with detailed profiles and field assignments.

### Grower List

**Each grower card displays**:

- **Profile Photo**: Visual identification
- **Name**: Full grower name
- **Category Badge**: Small/Medium/Large farmer
- **Village**: Primary location
- **Field Count**: Number of assigned fields
- **Yield Forecast**: Expected production in tons

### Grower Categories

- **Small**: Typically 1-2 fields, yield < 2,000 tons
- **Medium**: 3-5 fields, yield 4,000-7,000 tons
- **Large**: 6+ fields, yield 10,000-15,000 tons

### Search & Filter

**Search**:

- Type grower name, village, or phone number
- Instant results as you type

**Filter by Category**:

- Tap filter icon
- Select Small/Medium/Large
- View filtered list

### Adding a New Grower

1. Tap **+ (Plus)** button
2. Fill in the form:
   - **Personal Details**: Name, Father's Name, Age
   - **Contact**: Phone number
   - **Location**: Village, Region
   - **Category**: Auto-assigned based on fields
   - **Photo**: Optional profile picture
3. Tap **Save** to create profile

### Grower Details View

Tap any grower card to view:

**Profile Section**:

- Full name and photo
- Age and father's name
- Phone number (tap to call)
- Village and region
- Category badge

**Field Summary**:

- List of all fields owned
- Total acreage
- Crop distribution
- Yield forecast

**Quick Actions**:

- **Call**: Initiate phone call
- **Edit**: Update grower information
- **Add Field**: Create new field for this grower
- **View History**: See past activities

**Associated Tasks**:

- All advisory tasks across grower's plots
- Completion status
- Priority indicators

---

## Advisory Tasks Tab

### Overview

Manage field advisory tasks with priority-based workflow and detailed remarks capture.

### Task List

**Each task card shows**:

- **Title**: Task name (e.g., "Irrigation Required")
- **Priority Badge**: High (Red), Medium (Yellow), or Low (Gray)
- **Status**: Pending, Completed, or Overdue
- **Date**: Task deadline
- **Plot ID**: Associated plot (tap to view plot details)
- **Reason**: Why the task is needed
- **Action**: What needs to be done

### Task Statuses

1. **Pending** (Blue badge)
   - Task assigned but not started
   - Within deadline

2. **Overdue** (Red badge)
   - Past deadline
   - Requires immediate attention
   - Sorted to top of list

3. **Completed** (Green badge ✅)
   - Task finished
   - Includes completion remarks
   - Shows when completed

### Filter & Sort

**Filter by Status**:

- Tap filter dropdown at top
- Options: All, Pending, Completed, Overdue
- View changes instantly

**Filter by Priority**:

- Use the priority filter
- High/Medium/Low

**Sort Options**:

- By Date (newest/oldest)
- By Priority (high to low)
- By Status

### Completing a Task

1. **Tap a pending task card**
2. **Full-page task view opens** showing:
   - Task details
   - Plot information
   - Required action
   - Remarks section

3. **Add Remarks**:
   - Tap "Add Remarks" button
   - **Full-page remarks editor opens**
   - Text area for detailed notes
   - Optional: Attach photos/videos (📷 🎥 icons)
   - Character count indicator

4. **Submit**:
   - Tap "Submit Remarks" button at bottom
   - Task marked as completed
   - Badge changes to green ✅
   - Completion date recorded

5. **View Completed Tasks**:
   - Completed tasks show remarks on the card
   - Expandable remarks section
   - Timestamp of completion

### Task Details View

**Full Information**:

- Task title and description
- Associated plot with quick link
- Grower information
- Priority level
- Reason for task
- Recommended action
- Due date
- Current status

**Actions Available**:

- **Complete with Remarks**: Primary action
- **Edit**: Modify task details (if permissions allow)
- **Delete**: Remove task
- **Share**: Send task to others
- **View Plot**: Jump to plot details

### Remarks Best Practices

When adding remarks:

- **Be Specific**: Detail exactly what was done
- **Include Observations**: Note field conditions
- **Add Measurements**: Quantities used, areas covered
- **Attach Evidence**: Photos of before/after
- **Note Challenges**: Any issues encountered
- **Recommendations**: Suggestions for follow-up

**Example Good Remark**:

```
Applied 2 hours of drip irrigation to Plot PB/AMRITSAR/RAMPUR/RK/01
on June 15, 2024 at 6:00 AM. Soil moisture improved from Dry to
Moderate. No equipment issues. Recommend follow-up check in 3 days
to monitor moisture retention. Photo attached showing irrigation
coverage.
```

---

## Common Workflows

### Workflow 1: Daily Field Visit Routine

1. **Start on Analytics**
   - Review KPIs
   - Check overdue tasks (tap if any)
2. **Navigate to Advisory Tasks**
   - Filter by "Overdue" or "Pending"
   - Prioritize high-priority tasks
3. **For Each Task**:
   - Tap task card to open
   - Note the plot ID
   - Tap plot ID to view location
4. **Complete Tasks in Field**:
   - Perform required action
   - Open task
   - Add detailed remarks
   - Attach photos if available
   - Submit
5. **Verify Completion**:
   - Check task shows "Completed" ✅
   - Review remarks are saved

### Workflow 2: Adding a New Plot

1. **Navigate to Plot Tracker**

2. **Tap + Button**

3. **Choose Method**:
   - If grower exists: "Copy from existing grower"
   - If new grower: "Create new grower"

4. **Enter Plot Details**:
   - Plot location (auto-generates ID)
   - Acreage
   - Crop type and hybrid
   - Sowing date
   - Initial health status

5. **Set Geo-boundaries** (if on-site):
   - Walk the plot perimeter
   - Mark coordinates
   - Save boundary

6. **Save Plot**:
   - Review all details
   - Tap "Save"
   - Plot appears in list and map

### Workflow 3: Monitoring Plot Health

1. **Open Plot Tracker**

2. **Use Filters**:
   - Filter by status: "Moderate Stress" or "Severe Stress"
   - Or filter by specific crop
3. **Review Stressed Plots**:
   - Tap each plot card
   - Check stress reason
   - Review health metrics

4. **Check Related Tasks**:
   - Scroll to tasks section in plot details
   - See if advisory tasks exist
   - If none, consider creating one

5. **Take Action**:
   - Complete existing tasks with remarks
   - Or create new advisory task if needed

### Workflow 4: Grower Communication

1. **Navigate to Grower Profiles**

2. **Search for Grower**:
   - Type name in search bar
   - Or browse by village

3. **Open Grower Profile**:
   - View all plots
   - Check yield forecast
   - Review pending tasks

4. **Contact Grower**:
   - Tap phone number to call
   - Discuss plot status
   - Provide recommendations

5. **Follow-up**:
   - Create advisory task if needed
   - Update plot status after discussion
   - Add remarks to relevant tasks

---

## Tips & Best Practices

### Navigation Tips

1. **Use Tab Navigation Shortcuts**:
   - Bottom tabs are always accessible
   - No need to go back to home screen

2. **Tap KPIs for Quick Filtering**:
   - Analytics KPIs link to filtered views
   - Fastest way to see specific subsets

3. **Use Search Before Scrolling**:
   - Search is faster than browsing
   - Works across plots, growers, and tasks

### Data Entry Tips

1. **Plot ID Format**:
   - Always follows: State/City/Village/GrowerInitials/Number
   - System auto-generates, but verify accuracy
   - Example: `PB/AMRITSAR/RAMPUR/RK/01`

2. **Sowing Date Importance**:
   - Critical for crop cycle tracking
   - Affects task scheduling
   - Use accurate dates

3. **Audit Status**:
   - Update immediately after field verification
   - Keeps data reliable
   - Affects dashboard metrics

### Task Management Tips

1. **Complete Tasks Promptly**:
   - Avoid overdue accumulation
   - Add remarks while details are fresh
   - Photos provide valuable evidence

2. **Be Detailed in Remarks**:
   - Future reference for you and team
   - Helps identify patterns
   - Supports decision-making

3. **Use Priority Levels**:
   - High: Complete same day
   - Medium: Complete within 3 days
   - Low: Complete within week

### Performance Tips

1. **Filter Before Searching Large Lists**:
   - Reduces results
   - Faster performance
   - Easier to scan

2. **Use List View for Quick Scanning**:
   - See more plots at once
   - Faster than map view for large datasets

3. **Leverage Audit Status Filter**:
   - Focus on pending audits
   - Track verification progress

### Mobile Field Use Tips

1. **Offline Capability** (if implemented):
   - Complete tasks offline
   - Sync when back in coverage
   - Check sync status

2. **Battery Conservation**:
   - Map view uses more battery
   - Switch to list view when not navigating
   - Close app when not in use

3. **Photo Attachments**:
   - Take photos in good lighting
   - Include reference objects for scale
   - Compress before uploading if slow connection

### Data Quality Tips

1. **Regular Updates**:
   - Update plot status after each visit
   - Keep grower contacts current
   - Archive completed tasks periodically

2. **Consistent Naming**:
   - Use standard crop names
   - Consistent hybrid naming
   - Proper village names (all caps)

3. **Verify Before Saving**:
   - Double-check plot IDs
   - Confirm sowing dates
   - Validate acreage

---

## Troubleshooting

### Can't Find a Plot

- Check spelling in search
- Verify correct filters applied
- Ensure plot was saved successfully
- Try searching by grower name instead

### Task Not Showing as Completed

- Verify remarks were submitted
- Check if page refreshed
- Ensure you tapped "Submit Remarks" button
- Look in "Completed" filter

### Map Not Loading

- Check internet connection
- Try switching to list view
- Refresh the page
- Clear browser cache (if web version)

### Filter Not Working

- Tap "Clear All" and reapply
- Ensure at least one option is selected
- Check if "Apply" button was tapped
- Refresh the view

---

## Keyboard Shortcuts (Desktop/Tablet)

When using the app on larger screens:

- **Tab 1-4**: Switch between main tabs
- **Ctrl/Cmd + F**: Focus search bar
- **Escape**: Close dialogs/details views
- **Enter**: Submit forms

---

## Support & Feedback

### Need Help?

- Review this manual for detailed instructions
- Check the troubleshooting section
- Contact your system administrator

### Provide Feedback

- Report bugs to development team
- Suggest feature improvements
- Share workflow ideas

---

## Version Information

**Application**: Unified Field Assistant  
**Version**: 1.0  
**Optimized For**: iPhone 16 (Mobile-First)  
**Last Updated**: December 2024

---

## Quick Reference

### Plot ID Format

```
State/City/Village/GrowerInitials/Number
Example: PB/AMRITSAR/RAMPUR/RK/01
```

### Status Colors

- 🟢 **Green**: Healthy, Completed, Audited
- 🔴 **Red**: Severe Stress, Overdue, Urgent
- 🟡 **Yellow**: Moderate Stress, Pending
- 🔵 **Blue**: Informational, Total Tasks
- ⚪ **Gray**: Low Priority, Mild Stress

### Task Priorities

- **High**: Same-day completion required
- **Medium**: Complete within 3 days
- **Low**: Complete within 1 week

### Grower Categories

- **Small**: < 2,000 tons yield forecast
- **Medium**: 4,000-7,000 tons yield forecast
- **Large**: 10,000+ tons yield forecast

---

**End of User Manual**

For additional support or questions, please contact your system administrator or field operations manager.
