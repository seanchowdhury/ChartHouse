export const createChart = (chart) => {
  return $.ajax({
    method: 'POST',
    url: '/api/charts',
    data: {chart}
  });
};

export const requestChart = (chart) => {
  return $.ajax({
    method: 'GET',
    url: `/api/charts/${Object.keys(chart)[0]}`
  });
}

export const requestCharts = () => {
  return $.ajax({
    method: 'GET',
    url: '/api/charts'
  });
}
