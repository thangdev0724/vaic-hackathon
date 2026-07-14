/**
 * Shared mock fixtures used by both the local Vite dev plugin
 * (vite-plugins/mockApi.ts) and the Vercel serverless functions in api/ —
 * so the public deploy behaves the same as local dev until a real backend
 * replaces these endpoints.
 */

export const TRACE_EVENTS = [
  { id: '1', type: 'ROUTER', status: 'SUCCESS', title: 'Route resolved', detail: '/api/process', timestamp: Date.now(), payload: { path: '/api/process', method: 'POST' } },
  { id: '2', type: 'PLANNER', status: 'SUCCESS', title: 'Step 1: Analyze input', detail: 'Parsing user request', timestamp: Date.now() + 100, parentId: '1' },
  { id: '3', type: 'PLANNER', status: 'RUNNING', title: 'Step 2: Plan actions', detail: 'Generating action plan', timestamp: Date.now() + 200, parentId: '1' },
  { id: '4', type: 'TOOL_CALL', status: 'SUCCESS', title: 'search_index', detail: 'Query executed', timestamp: Date.now() + 300, payload: { tool: 'search_index', query: 'sample', results: 3 } },
  { id: '5', type: 'TOOL_CALL', status: 'RUNNING', title: 'fetch_data', detail: 'Retrieving records', timestamp: Date.now() + 400, payload: { tool: 'fetch_data', params: { limit: 10 } } },
  { id: '6', type: 'HUMAN_ESCALATION', status: 'PENDING', title: 'Confidence below threshold', detail: 'Awaiting human review', timestamp: Date.now() + 500, payload: { confidence: 0.42, threshold: 0.7 } },
]

export const MOCK_RESPONSE = `This is a mock cloud inference response. In production, replace mockCloudApi with your actual backend endpoint. The AI Gateway routes here when WebGPU is unavailable or when cloud mode is selected.`

export const MOCK_DASHBOARD = {
  title: 'Business Overview',
  stats: [
    { id: 'revenue', label: 'Revenue (MTD)', value: '$48,290', delta: '+12.4%', trend: 'up' },
    { id: 'orders', label: 'Orders', value: '1,284', delta: '+3.1%', trend: 'up' },
    { id: 'conversion', label: 'Conversion Rate', value: '3.8%', delta: '-0.4%', trend: 'down' },
    { id: 'tickets', label: 'Open Tickets', value: '27', delta: '0', trend: 'flat' },
  ],
  charts: [
    {
      id: 'weekly-revenue',
      type: 'bar',
      title: 'Weekly Revenue',
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      series: [{ name: 'Revenue', data: [4200, 5100, 4800, 6300, 7100, 5600, 4900] }],
    },
    {
      id: 'channel-split',
      type: 'donut',
      title: 'Orders by Channel',
      labels: ['Web', 'Mobile', 'Marketplace', 'In-store'],
      series: [{ name: 'Orders', data: [512, 348, 276, 148] }],
    },
  ],
  table: {
    columns: [
      { key: 'id', label: 'Order ID', sortable: true },
      { key: 'customer', label: 'Customer', sortable: true },
      { key: 'status', label: 'Status', sortable: true },
      { key: 'total', label: 'Total', sortable: true },
      { key: 'date', label: 'Date', sortable: true },
    ],
    rows: [
      { id: 'ORD-1042', customer: 'Nguyen Van A', status: 'Fulfilled', total: '$120.00', date: '2026-07-10' },
      { id: 'ORD-1043', customer: 'Tran Thi B', status: 'Processing', total: '$86.50', date: '2026-07-11' },
      { id: 'ORD-1044', customer: 'Le Van C', status: 'Fulfilled', total: '$254.20', date: '2026-07-12' },
      { id: 'ORD-1045', customer: 'Pham Thi D', status: 'Pending', total: '$42.00', date: '2026-07-13' },
      { id: 'ORD-1046', customer: 'Hoang Van E', status: 'Fulfilled', total: '$310.75', date: '2026-07-13' },
    ],
  },
}
