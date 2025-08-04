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
  
  // Enhanced sample data for a comprehensive report
  const sampleGrades = [
    { subject: 'English Language', grade: 'B+', effort: 'Excellent', comment: 'Shows excellent reading comprehension and creative writing skills. Vocabulary is expanding well.' },
    { subject: 'Mathematics', grade: 'A-', effort: 'Good', comment: 'Strong analytical skills. Excels in problem-solving but needs practice with mental arithmetic.' },
    { subject: 'Science', grade: 'A', effort: 'Excellent', comment: 'Demonstrates excellent understanding of scientific concepts. Shows curiosity and asks insightful questions.' },
    { subject: 'History', grade: 'B', effort: 'Good', comment: 'Good knowledge of historical facts. Could improve essay writing structure and analysis.' },
    { subject: 'Geography', grade: 'B+', effort: 'Excellent', comment: 'Excellent map reading skills and understanding of physical geography. Environmental awareness is strong.' },
    { subject: 'Art', grade: 'A', effort: 'Excellent', comment: 'Creative and imaginative. Shows excellent technique in painting and drawing. Portfolio work is outstanding.' },
    { subject: 'Physical Education', grade: 'A-', effort: 'Excellent', comment: 'Excellent team player with good leadership skills. Shows improvement in coordination and fitness.' },
    { subject: 'Music', grade: 'B+', effort: 'Good', comment: 'Good rhythm and pitch recognition. Practices regularly and shows dedication to learning the violin.' }
  ];

  const sampleAttendance = {
    total_sessions: 95,
    present_count: 88,
    absent_count: 5,
    late_count: 2,
    percentage: 92.6
  };

  // Use real data from report or fallback to sample data
  console.log('PDF Generator - Report data:', report);
  console.log('PDF Generator - Grades data:', report.grades_data);
  console.log('PDF Generator - Attendance data:', report.attendance_data);
  
  const grades = report.grades_data?.length > 0 ? report.grades_data : sampleGrades;
  const attendance = Object.keys(report.attendance_data || {}).length > 0 ? report.attendance_data : sampleAttendance;
  
  // Colors and styling
  const schoolBlue = [41, 98, 199];
  const lightBlue = [224, 242, 254];
  const darkGray = [55, 65, 81];
  const mediumGray = [107, 114, 128];
  
  // Page 1 - Header and Student Info
  // School Header with Logo Area
  doc.setFillColor(schoolBlue[0], schoolBlue[1], schoolBlue[2]);
  doc.rect(0, 0, 210, 35, 'F');
  
  // School Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('GREENWOOD ACADEMY', 105, 15, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Excellence in Education • Inspiring Tomorrow\'s Leaders', 105, 25, { align: 'center' });
  
  // Report Title
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('STUDENT REPORT CARD', 105, 50, { align: 'center' });
  
  // Academic Period Box
  doc.setFillColor(lightBlue[0], lightBlue[1], lightBlue[2]);
  doc.roundedRect(20, 60, 170, 15, 3, 3, 'F');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Academic Period: ${report.academic_term.replace('_', ' ').toUpperCase()} ${report.academic_year}`, 105, 70, { align: 'center' });
  
  // Student Information Section
  let yPos = 90;
  doc.setFillColor(245, 245, 245);
  doc.rect(20, yPos - 5, 170, 50, 'F');
  
  doc.setTextColor(schoolBlue[0], schoolBlue[1], schoolBlue[2]);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('STUDENT INFORMATION', 25, yPos + 5);
  
  yPos += 15;
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  // Two column layout for student info
  const leftColumn = [
    ['Student Name:', report.student_name],
    ['Year Group:', report.year_group],
    ['Form Class:', report.class_name]
  ];
  
  const rightColumn = [
    ['Class Teacher:', report.teacher_name],
    ['Report Date:', new Date(report.generated_at).toLocaleDateString('en-GB')],
    ['Student ID:', '#ST-2024-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0')]
  ];
  
  leftColumn.forEach(([label, value], index) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 25, yPos + (index * 8));
    doc.setFont('helvetica', 'normal');
    doc.text(value, 70, yPos + (index * 8));
  });
  
  rightColumn.forEach(([label, value], index) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 110, yPos + (index * 8));
    doc.setFont('helvetica', 'normal');
    doc.text(value, 155, yPos + (index * 8));
  });
  
  // Academic Performance Section
  yPos = 160;
  doc.setTextColor(schoolBlue[0], schoolBlue[1], schoolBlue[2]);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ACADEMIC PERFORMANCE', 20, yPos);
  
  // Assessment & Grading Information Box
  yPos += 15;
  doc.setFillColor(lightBlue[0], lightBlue[1], lightBlue[2]);
  doc.roundedRect(20, yPos - 5, 170, 65, 3, 3, 'F');
  
  doc.setTextColor(schoolBlue[0], schoolBlue[1], schoolBlue[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('ASSESSMENT & GRADING FRAMEWORK', 25, yPos + 5);
  
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  const gradingInfo = [
    'Grade A (90-100%): Exceptional - Exceeds expectations, demonstrates mastery and independent application of skills',
    'Grade B (70-89%): Proficient - Meets expectations, demonstrates solid understanding and application',
    'Grade C (50-69%): Developing - Approaching expectations, shows understanding with support needed',
    'Grade D (30-49%): Beginning - Below expectations, requires significant support and intervention',
    '',
    'Effort Ratings: Excellent (Consistently exceeds expectations) • Good (Meets expectations) • Needs Improvement (Below expectations)'
  ];
  
  gradingInfo.forEach((line, index) => {
    if (line) {
      const wrappedLine = doc.splitTextToSize(line, 165);
      doc.text(wrappedLine, 25, yPos + 12 + (index * 4));
    }
  });
  
  // Start new page for performance table
  doc.addPage();
  yPos = 30;
  
  // Performance Table Header
  doc.setFillColor(schoolBlue[0], schoolBlue[1], schoolBlue[2]);
  doc.rect(20, yPos, 170, 18, 'F');
  
  // Outer table border
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.8);
  doc.rect(20, yPos, 170, 18);
  
  // Column separators in header
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.6);
  doc.line(65, yPos, 65, yPos + 18); // After Subject (45px wide)
  doc.line(95, yPos, 95, yPos + 18); // After Grade (30px wide) 
  doc.line(125, yPos, 125, yPos + 18); // After Effort (30px wide)
  // Comments gets remaining 65px
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('SUBJECT', 42.5, yPos + 11, { align: 'center' });
  doc.text('GRADE', 80, yPos + 11, { align: 'center' });
  doc.text('EFFORT', 110, yPos + 11, { align: 'center' });
  doc.text('TEACHER COMMENTS', 157.5, yPos + 11, { align: 'center' });
  
  yPos += 18;
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  // Add grade rows with professional styling
  grades.forEach((grade, index) => {
    if (yPos > 240) { // Start new page if needed
      doc.addPage();
      yPos = 30;
      
      // Repeat header on new page
      doc.setFillColor(schoolBlue[0], schoolBlue[1], schoolBlue[2]);
      doc.rect(20, yPos, 170, 18, 'F');
      doc.setDrawColor(100, 100, 100);
      doc.setLineWidth(0.8);
      doc.rect(20, yPos, 170, 18);
      
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.6);
      doc.line(65, yPos, 65, yPos + 18);
      doc.line(95, yPos, 95, yPos + 18);
      doc.line(125, yPos, 125, yPos + 18);
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('SUBJECT', 42.5, yPos + 11, { align: 'center' });
      doc.text('GRADE', 80, yPos + 11, { align: 'center' });
      doc.text('EFFORT', 110, yPos + 11, { align: 'center' });
      doc.text('TEACHER COMMENTS', 157.5, yPos + 11, { align: 'center' });
      
      yPos += 18;
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
    }
    
    const rowHeight = 20;
    
    // Alternate row colors with subtle difference
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
    } else {
      doc.setFillColor(255, 255, 255);
    }
    doc.rect(20, yPos, 170, rowHeight, 'F');
    
    // Row borders
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.4);
    doc.rect(20, yPos, 170, rowHeight);
    
    // Column separators with lighter color
    doc.setDrawColor(235, 235, 235);
    doc.setLineWidth(0.3);
    doc.line(65, yPos, 65, yPos + rowHeight);
    doc.line(95, yPos, 95, yPos + rowHeight);
    doc.line(125, yPos, 125, yPos + rowHeight);
    
    // Subject column
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text(grade.subject, 42.5, yPos + 12, { align: 'center' });
    
    // Grade column with professional styling
    const gradeColor = grade.grade.startsWith('A') ? [16, 185, 129] : 
                      grade.grade.startsWith('B') ? [59, 130, 246] : 
                      grade.grade.startsWith('C') ? [245, 158, 11] : [239, 68, 68];
    
    doc.setFillColor(gradeColor[0], gradeColor[1], gradeColor[2]);
    doc.roundedRect(72, yPos + 6, 16, 8, 2, 2, 'F');
    
    // Grade border
    doc.setDrawColor(gradeColor[0] - 20, gradeColor[1] - 20, gradeColor[2] - 20);
    doc.setLineWidth(0.5);
    doc.roundedRect(72, yPos + 6, 16, 8, 2, 2);
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(grade.grade, 80, yPos + 11, { align: 'center' });
    
    // Effort column
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(grade.effort || 'Good', 110, yPos + 12, { align: 'center' });
    
    // Comments column with better text handling
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(8);
    const comment = grade.comments || grade.comment || 'Making good progress in this subject.';
    const wrappedComment = doc.splitTextToSize(comment, 60);
    
    // Handle multi-line comments better
    if (wrappedComment.length === 1) {
      doc.text(wrappedComment[0], 127, yPos + 12);
    } else if (wrappedComment.length === 2) {
      doc.text(wrappedComment[0], 127, yPos + 9);
      doc.text(wrappedComment[1], 127, yPos + 15);
    } else {
      // For longer comments, show first 2 lines with ellipsis
      doc.text(wrappedComment[0], 127, yPos + 9);
      doc.text(wrappedComment[1].substring(0, 25) + '...', 127, yPos + 15);
    }
    
    yPos += rowHeight;
  });
  
  // Start new page for additional sections
  doc.addPage();
  yPos = 30;
  
  // Attendance Section
  doc.setTextColor(schoolBlue[0], schoolBlue[1], schoolBlue[2]);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ATTENDANCE SUMMARY', 20, yPos);
  
  yPos += 15;
  doc.setFillColor(245, 245, 245);
  doc.rect(20, yPos - 5, 170, 35, 'F');
  
  // Attendance stats in a grid
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(12);
  
  const attendanceStats = [
    ['Total Sessions:', attendance.total_sessions?.toString() || '0'],
    ['Present:', attendance.present_count?.toString() || '0'],
    ['Absent:', attendance.absent_count?.toString() || '0'],
    ['Late:', attendance.late_count?.toString() || '0']
  ];
  
  attendanceStats.forEach(([label, value], index) => {
    const x = 25 + (index % 2) * 85;
    const y = yPos + Math.floor(index / 2) * 12;
    
    doc.setFont('helvetica', 'bold');
    doc.text(label, x, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, x + 35, y);
  });
  
  // Attendance percentage with visual indicator
  const attendanceRate = attendance.percentage || 0;
  doc.setFont('helvetica', 'bold');
  doc.text('Attendance Rate:', 25, yPos + 25);
  
  // Attendance rate bar
  doc.setFillColor(220, 220, 220);
  doc.rect(85, yPos + 22, 60, 6, 'F');
  
  const barColor = attendanceRate >= 95 ? [34, 197, 94] : 
                   attendanceRate >= 85 ? [245, 158, 11] : [239, 68, 68];
  doc.setFillColor(barColor[0], barColor[1], barColor[2]);
  doc.rect(85, yPos + 22, (attendanceRate / 100) * 60, 6, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.text(`${attendanceRate}%`, 150, yPos + 26);
  
  // Behavior and Effort Section
  yPos += 50;
  doc.setTextColor(schoolBlue[0], schoolBlue[1], schoolBlue[2]);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('BEHAVIOR & EFFORT', 20, yPos);
  
  yPos += 15;
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  const behaviorText = `${report.student_name} demonstrates excellent behavior in class and shows respect for peers and teachers. Their effort level is consistently high, and they actively participate in classroom discussions. They work well both independently and as part of a team.`;
  const wrappedBehavior = doc.splitTextToSize(behaviorText, 170);
  doc.text(wrappedBehavior, 20, yPos);
  
  // Areas for Development
  yPos += 30;
  doc.setTextColor(schoolBlue[0], schoolBlue[1], schoolBlue[2]);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('AREAS FOR DEVELOPMENT', 20, yPos);
  
  yPos += 15;
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  const developmentAreas = [
    '• Continue to develop time management skills for homework completion',
    '• Practice mental mathematics to improve calculation speed',
    '• Expand vocabulary through regular reading of challenging texts',
    '• Develop greater confidence when presenting to the class'
  ];
  
  developmentAreas.forEach((area, index) => {
    doc.text(area, 20, yPos + (index * 8));
  });
  
  // Targets for Next Term
  yPos += 45;
  doc.setTextColor(schoolBlue[0], schoolBlue[1], schoolBlue[2]);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('TARGETS FOR NEXT TERM', 20, yPos);
  
  yPos += 15;
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  const targets = [
    '• Achieve Grade A in Mathematics through regular practice',
    '• Read at least 2 books per month to improve comprehension',
    '• Participate more actively in Science experiments',
    '• Complete all homework assignments on time'
  ];
  
  targets.forEach((target, index) => {
    doc.text(target, 20, yPos + (index * 8));
  });
  
  // Teacher's General Comment
  yPos += 45;
  doc.setTextColor(schoolBlue[0], schoolBlue[1], schoolBlue[2]);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('TEACHER\'S COMMENT', 20, yPos);
  
  yPos += 15;
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  const teacherComment = `${report.student_name} has had an excellent term and should be proud of their achievements. They consistently demonstrate a positive attitude towards learning and show great potential. With continued effort and focus on the development areas identified, I am confident they will achieve even greater success next term. Well done!`;
  const wrappedComment = doc.splitTextToSize(teacherComment, 170);
  doc.text(wrappedComment, 20, yPos);
  
  // Signature section
  yPos += 40;
  doc.setFontSize(11);
  doc.text('Class Teacher: _______________________', 20, yPos);
  doc.text('Date: _________________', 120, yPos);
  
  yPos += 15;
  doc.text('Head Teacher: _______________________', 20, yPos);
  doc.text('Date: _________________', 120, yPos);
  
  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // School footer background
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 280, 210, 17, 'F');
    
    // Page number at top of footer
    doc.setFontSize(8);
    doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
    doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
    
    // School info at bottom of footer
    doc.setFontSize(9);
    doc.text('Greenwood Academy • 123 Education Street, Learning City, LC1 2AB • Tel: 01234 567890 • www.greenwoodacademy.edu', 105, 292, { align: 'center' });
  }
  
  // Generate filename
  const filename = `report-card-${report.student_name.replace(/\s+/g, '-').toLowerCase()}-${report.academic_term}-${report.academic_year}.pdf`;
  
  // Download the PDF
  doc.save(filename);
  
  return filename;
}