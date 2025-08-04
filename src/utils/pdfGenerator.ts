import jsPDF from 'jspdf';

interface ReportCard {
  id: string;
  student_name: string;
  year_group: string;
  academic_term: string;
  academic_year: string;
  status: string;
  generated_at: string;
  teacher_name: string;
  grades_data: any[];
  attendance_data: any;
  class_name: string;
}

export function generateReportCardPDF(report: ReportCard) {
  const doc = new jsPDF();
  
  // Set up colors and fonts
  const primaryColor = [59, 130, 246]; // Blue
  const secondaryColor = [75, 85, 99]; // Gray
  
  // Header
  doc.setFillColor(59, 130, 246); // Blue
  doc.rect(0, 0, 210, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('SCHOOL REPORT CARD', 105, 16, { align: 'center' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Student Information Section
  let yPos = 40;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Information', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  const studentInfo = [
    ['Student Name:', report.student_name],
    ['Year Group:', report.year_group],
    ['Class:', report.class_name],
    ['Academic Term:', `${report.academic_term} ${report.academic_year}`],
    ['Class Teacher:', report.teacher_name],
    ['Report Generated:', new Date(report.generated_at).toLocaleDateString()]
  ];
  
  studentInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 70, yPos);
    yPos += 8;
  });
  
  // Academic Performance Section
  yPos += 10;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Academic Performance', 20, yPos);
  
  yPos += 10;
  
  if (Array.isArray(report.grades_data) && report.grades_data.length > 0) {
    // Create table header
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos - 5, 170, 10, 'F');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Subject', 25, yPos);
    doc.text('Grade', 100, yPos);
    doc.text('Comments', 130, yPos);
    
    yPos += 10;
    doc.setFont('helvetica', 'normal');
    
    // Add grade rows
    report.grades_data.forEach((grade, index) => {
      if (yPos > 250) { // Start new page if needed
        doc.addPage();
        yPos = 30;
      }
      
      // Alternate row colors
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(20, yPos - 5, 170, 8, 'F');
      }
      
      doc.text(grade.subject || 'N/A', 25, yPos);
      doc.text(grade.grade || 'N/A', 100, yPos);
      doc.text(grade.comment || 'Good progress', 130, yPos);
      yPos += 8;
    });
  } else {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.text('No grades recorded for this term.', 20, yPos);
    yPos += 15;
  }
  
  // Attendance Section
  yPos += 10;
  if (yPos > 240) {
    doc.addPage();
    yPos = 30;
  }
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Attendance Summary', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  const attendance = report.attendance_data || {};
  const attendanceInfo = [
    ['Total Sessions:', attendance.total_sessions || '0'],
    ['Present:', attendance.present_count || '0'],
    ['Absent:', attendance.absent_count || '0'],
    ['Late:', attendance.late_count || '0'],
    ['Attendance Rate:', `${attendance.percentage || '0'}%`]
  ];
  
  attendanceInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 80, yPos);
    yPos += 8;
  });
  
  // Comments Section
  yPos += 15;
  if (yPos > 230) {
    doc.addPage();
    yPos = 30;
  }
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Teacher Comments', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  const generalComment = `${report.student_name} has shown consistent effort and engagement throughout the ${report.academic_term} term. There are areas for continued development, and we look forward to supporting their progress in the upcoming term.`;
  
  // Split long text into lines
  const splitComment = doc.splitTextToSize(generalComment, 170);
  doc.text(splitComment, 20, yPos);
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
    doc.text('This document is generated electronically and does not require a signature.', 105, 290, { align: 'center' });
  }
  
  // Generate filename
  const filename = `report-card-${report.student_name.replace(/\s+/g, '-').toLowerCase()}-${report.academic_term}-${report.academic_year}.pdf`;
  
  // Download the PDF
  doc.save(filename);
  
  return filename;
}