# Notification System Design

## Architecture Diagram

```
+-------------------------------------------------------------+
|                     Frontend Application                    |
|                      (Vite + React)                         |
|                                                             |
|  +----------------+  +-----------------+  +--------------+  |
|  | UI Components  |  | Notification    |  | Logging      |  |
|  | (Notification  |->| Context (State) |->| Middleware   |  |
|  |  List, Filters)|  |                 |  | (logger.ts)  |  |
|  +----------------+  +-----------------+  +--------------+  |
|          |                   |                    |         |
+----------|-------------------|--------------------|---------+
           |                   |                    |
       [User Actions]      [API Fetch]         [POST /logs]
           |                   |                    |
           v                   v                    v
+-------------------------------------------------------------+
|                  Evaluation API Services                    |
|               (http://20.207.122.201)                       |
|                                                             |
|  +----------------+  +-----------------+  +--------------+  |
|  |   /register    |  | /notifications  |  |    /logs     |  |
|  |     /auth      |  | (GET)           |  |    (POST)    |  |
|  +----------------+  +-----------------+  +--------------+  |
+-------------------------------------------------------------+
```

## Data Flow
1. **Initialization:** On startup, the app registers/authenticates (or uses a predefined `.env` token). The `access_token` is stored securely in-memory using `setLogAccessToken` to avoid `localStorage` vulnerabilities.
2. **UI -> Logging Middleware:** Every key action (page load, button click, API success/failure) triggers the `Log()` utility. The payload components (stack, level, package, message) are strictly lowercased and sent to `/logs` with the `Bearer` token.
3. **Notification Fetching:** The UI invokes `getNotifications()` via a React `useEffect` or button click. The response is parsed, and the algorithm kicks in.

## Notification Fetching & Priority Selection Logic
- **Fetching:** Since the API returns a raw list, the client fetches the payload dynamically.
- **Algorithm (Stage 1):** The data is parsed and sorted descending by `timestamp` using a standard `Array.prototype.sort()`.
- **Top N (Priority) Selection:** We slice the top N items (default 10). 
- **Maintaining Top N (Min-Heap Approach):**
  If this were a real-time system (e.g., WebSockets), re-sorting the whole array on every new notification is expensive `O(K log K)`. Instead, we can use a **Min-Heap** of size N. 
  - Insert first N elements into the Min-Heap.
  - For every subsequent element, if its timestamp is greater than the root (minimum of the top N), remove the root and insert the new element.
  - This keeps the complexity for processing new items to `O(log N)` instead of `O(K log K)`.

## Error Handling Approach
- API calls are wrapped in `try-catch` blocks.
- On failure, we invoke `Log('frontend', 'error', 'api', 'api request failed')`.
- UI displays user-friendly error states (e.g., "Failed to load notifications. Please try again.").

## Scaling Considerations
- **Pagination:** As notifications grow, client-side filtering/sorting becomes a bottleneck. In a production app, the API should handle limit/offset and sorting.
- **WebSockets / SSE:** For real-time notifications, Server-Sent Events or WebSockets should be implemented instead of polling.
- **State Management:** Using React Context is sufficient for this scope. For larger apps, Zustand or Redux would help separate API caching from UI state.
