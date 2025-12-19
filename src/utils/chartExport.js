import html2canvas from 'html2canvas';

export const exportChartAsPNG = async (element) => {
  const canvas = await html2canvas(element);
  const image = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = image;
  link.download = `workout-chart-${new Date().toISOString().slice(0,10)}.png`;
  link.click();
};

export const exportChartDataAsCSV = (data) => {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'workout-data.csv';
  link.click();
};