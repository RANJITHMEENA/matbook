export const SAMPLE_WORKFLOWS = [
  {
    id: "wf-1",
    title: "User Registration Flow",
    createdAt: "2024-02-15T10:30:00Z",
    updatedAt: "2024-02-15T10:30:00Z",
    status: "active",
    elements: [
      {
        id: "api-1",
        type: "apiCall",
        position: 1,
        config: {
          method: "POST",
          url: "https://api.example.com/users",
          headers: "Content-Type: application/json",
          body: "{\n  \"name\": \"{{name}}\",\n  \"email\": \"{{email}}\"\n}"
        }
      },
      {
        id: "email-1",
        type: "email",
        position: 2,
        config: {
          value: "welcome@company.com"
        }
      }
    ]
  },
  {
    id: "wf-2",
    title: "Order Processing Workflow",
    createdAt: "2024-02-14T15:45:00Z",
    updatedAt: "2024-02-15T09:20:00Z",
    status: "active",
    elements: [
      {
        id: "api-1",
        type: "apiCall",
        position: 1,
        config: {
          method: "POST",
          url: "https://api.example.com/orders",
          headers: "Content-Type: application/json",
          body: "{\n  \"orderId\": \"{{orderId}}\",\n  \"amount\": {{amount}}\n}"
        }
      },
      {
        id: "text-1",
        type: "textBox",
        position: 2,
        config: {
          value: "Process payment and update inventory"
        }
      },
      {
        id: "email-1",
        type: "email",
        position: 3,
        config: {
          value: "orders@company.com"
        }
      }
    ]
  },
  {
    id: "wf-3",
    title: "Customer Support Ticket",
    createdAt: "2024-02-13T08:15:00Z",
    updatedAt: "2024-02-13T08:15:00Z",
    status: "inactive",
    elements: [
      {
        id: "api-1",
        type: "apiCall",
        position: 1,
        config: {
          method: "GET",
          url: "https://api.example.com/tickets/{{ticketId}}",
          headers: "Authorization: Bearer {{token}}",
          body: ""
        }
      },
      {
        id: "email-1",
        type: "email",
        position: 2,
        config: {
          value: "support@company.com"
        }
      }
    ]
  },
  {
    id: "wf-4",
    title: "Inventory Update Process",
    createdAt: "2024-02-12T11:20:00Z",
    updatedAt: "2024-02-14T16:45:00Z",
    status: "active",
    elements: [
      {
        id: "api-1",
        type: "apiCall",
        position: 1,
        config: {
          method: "PUT",
          url: "https://api.example.com/inventory/{{productId}}",
          headers: "Content-Type: application/json",
          body: "{\n  \"quantity\": {{quantity}},\n  \"location\": \"{{location}}\"\n}"
        }
      },
      {
        id: "text-1",
        type: "textBox",
        position: 2,
        config: {
          value: "Update inventory records in system"
        }
      }
    ]
  },
  {
    id: "wf-5",
    title: "Newsletter Campaign",
    createdAt: "2024-02-11T09:00:00Z",
    updatedAt: "2024-02-15T14:30:00Z",
    status: "active",
    elements: [
      {
        id: "api-1",
        type: "apiCall",
        position: 1,
        config: {
          method: "GET",
          url: "https://api.example.com/subscribers",
          headers: "Authorization: Bearer {{token}}",
          body: ""
        }
      },
      {
        id: "text-1",
        type: "textBox",
        position: 2,
        config: {
          value: "Prepare newsletter content"
        }
      },
      {
        id: "email-1",
        type: "email",
        position: 3,
        config: {
          value: "newsletter@company.com"
        }
      }
    ]
  }
]; 