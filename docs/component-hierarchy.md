## Component Hierarchy

### AuthFormContainer
  - AuthForm

### NavBarContainer
  - Logo
  - Links

### DashboardContainer
  - NavBarContainer
  - ChartContainer
  - CourseContainer
  - FriendContainer (BONUS)

### Courses

### CreateCourseContainer
  - MapContainer
  - CourseFormContainer

### CourseFormContainer
  - Course Detail Input

### CourseDetailsContainer
  - MapContainer
  - Course Detail

### CourseIndexContainer
  - Course Details

### CourseContainer
  - CourseIndexContainer
  - CourseDetailsContainer

### Charts

### ChartFormContainer
  - Chart Detail Input

### ChartDetailsContainer
  - Chart Details
  - Chart Calculations

### ChartIndexContainer
  - Chart Details

### ChartContainer
  - ChartIndexContainer
  - ChartDetailsContainer

### Map

### MapContainer
  - Map Details

## Routes

|Path   | Component   |
|-------|-------------|
| "/sign-up" | "AuthFormContainer" |
| "/sign-in" | "AuthFormContainer" |
| "/home" | "DashboardContainer" |
| "/courses/" | "CourseIndexContainer" |
| "/courses/:courseId" | "CourseDetailContainer" |
| "/courses/new" | "CreateCourseContainer" |
| "/courses/:courseId/edit" | "CourseFormContainer" |
| "/charts/" | "ChartsIndexContainer" |
| "/charts/:chartsId" | "ChartsDetailContainer" |
| "/charts/new" | "ChartsCourseContainer" |
| "/charts/:chartsId/edit" | "ChartsFormContainer" |
