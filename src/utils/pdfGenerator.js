import generatePDF from "react-to-pdf";
import moment from 'moment';


export const downloadPdf = (pdfName) => {
  const getTargetElement = () => document.getElementById("dashboardPdf");
  
   // Inject the CSS for page breaks
  // injectStyles();

  // Temporarily hide the element to be excluded
  const elementToExclude = document.getElementById("removedashboardPdf");
  if (elementToExclude) {
    elementToExclude.style.display = 'none';
  }
  return generatePDF(getTargetElement, {
    filename: `${pdfName}_${moment().format('DD-MM-YYYY')}.pdf`,
    page: {
      margin: 20
    }
  }).then(() => {
    // Show the element again
    if (elementToExclude) {
      elementToExclude.style.display = '';
    }
  }).catch((error) => {
    console.error('Error generating PDF:', error);

    // Make sure to show the element again in case of an error
    if (elementToExclude) {
      elementToExclude.style.display = '';
    }
  });
};