# Agile Development Framework

## 1. Introduction

This folder contains all the necessary documents to manage the development of the project using a simple, lightweight agile framework. The process is designed to be transparent and easy to manage directly within the codebase using markdown files.

## 2. Our Workflow

The development process flows from high-level ideas to specific, actionable tasks:

1.  **Ideas & Future Features:** All new ideas, feature requests, and brainstorming outputs are first captured as a simple list in [`backlog.md`](./backlog.md).

2.  **Epics:** When an idea is prioritized for development, it is promoted to an "Epic." An Epic represents a large body of work or a major feature (e.g., "Admin Analytics Dashboard"). Each Epic gets its own dedicated file within the [`/epics`](./epics/) directory (e.g., `EPIC-002-admin-analytics.md`).

3.  **User Stories:** Each Epic is broken down into smaller, user-centric requirements called "User Stories." They follow the format: **"As a [persona], I want to [action] so that [benefit]."** Stories are the primary unit for planning and estimation.

4.  **Tasks:** Each User Story is further broken down into concrete, technical tasks that engineers will work on (e.g., "Create new database table," "Add button to UI," "Implement API endpoint").

5.  **Bugs:** Bugs are issues found in the live product or during testing. They are tracked in [`bug_tracker.md`](./bug_tracker.md).

## 3. Estimations (Story Points)

To gauge the effort required for each User Story (not tasks), we use **Story Points**. Story points are abstract units that measure complexity, uncertainty, and effort. We use a modified Fibonacci sequence for pointing:

**1, 2, 3, 5, 8, 13**

*   **1:** A very small, well-understood task.
*   **3:** A straightforward task with a few steps.
*   **5:** A moderately complex story that may involve changes in both frontend and backend.
*   **8:** A complex story with multiple parts or some technical uncertainty.
*   **13:** A very complex story that should probably be broken down into smaller stories.

## 4. Key Documents

*   **[`execution_tracker.md`](./execution_tracker.md):** The high-level project roadmap. It tracks our major milestones and which Epics are associated with them.
*   **[`backlog.md`](./backlog.md):** The parking lot for all future ideas and feature requests.
*   **[`bug_tracker.md`](./bug_tracker.md):** A running list of all identified bugs and their status.
*   **[`/epics`](./epics/):** A directory containing the detailed breakdown of all Epics into User Stories and Tasks.
