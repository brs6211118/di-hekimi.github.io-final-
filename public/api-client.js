// API Client for Backend Integration
class APIClient {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
    this.collections = ['patients', 'appts', 'inventory', 'invoices', 'users', 'audit'];
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Collection CRUD operations
  async getAll(collection, query = {}) {
    const params = new URLSearchParams(query).toString();
    const endpoint = `/api/${collection}${params ? `?${params}` : ''}`;
    return await this.request(endpoint);
  }

  async getById(collection, id) {
    return await this.request(`/api/${collection}/${id}`);
  }

  async create(collection, data) {
    return await this.request(`/api/${collection}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async update(collection, id, data) {
    return await this.request(`/api/${collection}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async delete(collection, id) {
    return await this.request(`/api/${collection}/${id}`, {
      method: 'DELETE'
    });
  }

  // Bulk operations
  async import(collection, data) {
    return await this.request(`/api/${collection}/import`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async exportAll() {
    return await this.request('/api/export/all');
  }

  async importAll(data) {
    return await this.request('/api/import/all', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async health() {
    return await this.request('/health');
  }
}

// Initialize API client
window.API = new APIClient();

// Test API connection
async function testAPIConnection() {
  const statusEl = document.getElementById('apiStatus');
  if (!statusEl) return;

  try {
    await API.health();
    statusEl.textContent = '✅ Connected';
    statusEl.style.color = '#10b981';
    return true;
  } catch (error) {
    statusEl.textContent = '❌ Offline';
    statusEl.style.color = '#ef4444';
    console.error('API connection failed:', error);
    return false;
  }
}

// Auto-test connection when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', testAPIConnection);
} else {
  testAPIConnection();
}