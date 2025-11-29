# Manual Testing Checklist

## Purpose
Verify that the refactored code maintains all existing functionality and visual appearance.

## Test Environment
- Browser: Chrome/Safari/Firefox
- Device: Desktop and Mobile
- Locale: Japanese (ja) and English (en)

## Pre-Test Setup
1. ✅ Build the application: `pnpm build`
2. ✅ Start the development server: `pnpm dev`
3. ✅ Open browser to `http://localhost:3000`

## Test Cases

### 1. Quiz Session Flow
**Objective:** Verify complete quiz flow works correctly

- [ ] **1.1** Navigate to quiz page
  - Expected: Quiz session initializes successfully
  - Expected: Timer starts at 0:00
  - Expected: Progress bar shows "Question 1/20"

- [ ] **1.2** Answer first question
  - Expected: Can select an answer choice
  - Expected: Feedback appears immediately after selection
  - Expected: Correct/incorrect indicator shows
  - Expected: Explanation displays

- [ ] **1.3** Click "Next Question" button
  - Expected: Button appears after feedback
  - Expected: Button has haunted orange styling
  - Expected: Button has hover effect (scale up)
  - Expected: Moves to question 2

- [ ] **1.4** Answer all 20 questions
  - Expected: Progress bar updates correctly
  - Expected: Timer continues running
  - Expected: Correct count updates

- [ ] **1.5** Complete quiz
  - Expected: "View Results" button appears on last question
  - Expected: Clicking button navigates to results page

### 2. Results Page
**Objective:** Verify results display correctly

- [ ] **2.1** Results page loads
  - Expected: Ghost reaction emoji displays
  - Expected: Score percentage shows
  - Expected: Correct answer count shows (X/20)
  - Expected: Time taken displays

- [ ] **2.2** Domain breakdown
  - Expected: All 4 domains show
  - Expected: Each domain shows correct/total
  - Expected: Each domain shows percentage
  - Expected: Progress bars display correctly

- [ ] **2.3** Restart button
  - Expected: "新しいクイズを始める 🎃" button displays
  - Expected: Button has haunted orange styling
  - Expected: Button has hover effect (scale up, shadow increase)
  - Expected: Clicking button starts new quiz

### 3. Button Component Visual Verification
**Objective:** Verify buttons maintain original appearance

- [ ] **3.1** Next Question button (quiz-session)
  - Expected: Haunted orange background
  - Expected: Dark text color
  - Expected: Glow effect around button
  - Expected: Hover: scales up to 105%
  - Expected: Active: scales down to 95%
  - Expected: Focus: ring appears

- [ ] **3.2** Restart button (results-summary)
  - Expected: Haunted orange background
  - Expected: Dark text color
  - Expected: Glow effect around button
  - Expected: Hover: scales up to 105%, shadow increases
  - Expected: Active: scales down to 95%
  - Expected: Focus: ring appears

### 4. Responsive Design
**Objective:** Verify buttons work on different screen sizes

- [ ] **4.1** Desktop (1920x1080)
  - Expected: Buttons display at full size
  - Expected: Text is readable
  - Expected: Spacing is appropriate

- [ ] **4.2** Tablet (768x1024)
  - Expected: Buttons scale appropriately
  - Expected: Text remains readable
  - Expected: Touch targets are adequate (min 48px)

- [ ] **4.3** Mobile (375x667)
  - Expected: Buttons scale down appropriately
  - Expected: Text remains readable
  - Expected: Touch targets are adequate (min 48px)

### 5. Accessibility
**Objective:** Verify accessibility features work

- [ ] **5.1** Keyboard navigation
  - Expected: Can tab to buttons
  - Expected: Can activate with Enter/Space
  - Expected: Focus ring is visible

- [ ] **5.2** Screen reader
  - Expected: Buttons have appropriate aria-labels
  - Expected: Button purpose is announced
  - Expected: State changes are announced

### 6. Validation Functions
**Objective:** Verify validation works correctly

- [ ] **6.1** Valid questions load
  - Expected: Quiz initializes with 20 questions
  - Expected: All questions have 4 choices
  - Expected: All questions have explanations

- [ ] **6.2** Error handling
  - Expected: Invalid questions are filtered out
  - Expected: Error messages are logged to console
  - Expected: App continues to function

### 7. Performance
**Objective:** Verify no performance degradation

- [ ] **7.1** Initial load time
  - Expected: Page loads in < 3 seconds
  - Expected: No visible lag

- [ ] **7.2** Button interactions
  - Expected: Buttons respond immediately to clicks
  - Expected: Hover effects are smooth
  - Expected: No jank or stuttering

- [ ] **7.3** Quiz navigation
  - Expected: Moving between questions is instant
  - Expected: No delays in feedback display

## Test Results

### Test Date: _______________
### Tester: _______________

### Summary
- Total Tests: 30
- Passed: ___
- Failed: ___
- Blocked: ___

### Issues Found
1. _______________________________________
2. _______________________________________
3. _______________________________________

### Notes
_____________________________________________
_____________________________________________
_____________________________________________

## Sign-off

- [ ] All critical tests passed
- [ ] No visual regressions detected
- [ ] Performance is acceptable
- [ ] Accessibility features work correctly

**Approved by:** _______________
**Date:** _______________
