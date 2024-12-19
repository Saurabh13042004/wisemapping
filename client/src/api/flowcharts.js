import axiosInstance from './axiosInstance';

export const getAllFlowcharts = async () => {
  try {
    const response = await axiosInstance.get('/flowcharts');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFlowchartById = async(id) => {
  try {
    const response = await axiosInstance.get(`/flowcharts/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const createFlowchart = async(data) => {
  try{
    const response = await axiosInstance.post(
      '/flowcharts',
      data
    );
    return response.data;
  } catch (e) {
    throw error;
  }
}

export const updateFlowChartbyId = async(id, data) => {
  try{
    const response = await axiosInstance.put(
      `/flowcharts/${id}`,
      data
    );
    return response.data;
  } catch (e) {
    throw error;
  }
}
