import axios from 'axios';

const API_BASE = 'http://localhost:5000/moneylender';

export const fetchCustomers = async () => {
  const response = await axios.get(`${API_BASE}/getall`);
  return response.data.customers;
};

export const addCustomer = async (customer) => {
  const response = await axios.post(`${API_BASE}/add`, {
    ...customer,
    Cus_Id: parseInt(customer.Cus_Id),
    Loan_Amt: parseFloat(customer.Loan_Amt),
    Intrest_rate: parseFloat(customer.Intrest_rate),
    paid: parseFloat(customer.paid),
    unpaid: parseFloat(customer.unpaid),
    PPD: parseInt(customer.PPD)
  });
  return response.data;
};