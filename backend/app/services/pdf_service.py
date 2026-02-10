from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from io import BytesIO
from datetime import datetime

def generate_pdf_report(user, attempt):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    story = []
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1a73e8'),
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#1a73e8'),
        spaceAfter=12,
        spaceBefore=12
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=11,
        alignment=TA_JUSTIFY,
        spaceAfter=12
    )
    
    story.append(Paragraph("PromptForge AI", title_style))
    story.append(Paragraph("Prompt Evaluation Report", styles['Heading2']))
    story.append(Spacer(1, 0.3*inch))
    
    story.append(Paragraph("User Information", heading_style))
    user_data = [
        ["Name:", user.name],
        ["Email:", user.email],
        ["Level:", user.level],
        ["Total XP:", str(user.xp)],
        ["Total Attempts:", str(user.total_attempts)],
        ["Report Date:", datetime.now().strftime("%B %d, %Y")]
    ]
    user_table = Table(user_data, colWidths=[2*inch, 4*inch])
    user_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f0f0f0')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey)
    ]))
    story.append(user_table)
    story.append(Spacer(1, 0.3*inch))
    
    story.append(Paragraph("Problem Statement", heading_style))
    story.append(Paragraph(attempt.problem_text, normal_style))
    story.append(Spacer(1, 0.2*inch))
    
    story.append(Paragraph("Your Prompt", heading_style))
    story.append(Paragraph(attempt.user_prompt, normal_style))
    story.append(Spacer(1, 0.2*inch))
    
    story.append(Paragraph("Evaluation Scores", heading_style))
    score_data = [
        ["Metric", "Score"],
        ["Overall Score", f"{attempt.overall_score:.1f}/100"],
        ["Clarity", f"{attempt.clarity_score:.1f}/100"],
        ["Structure", f"{attempt.structure_score:.1f}/100"],
        ["Specificity", f"{attempt.specificity_score:.1f}/100"],
        ["Context", f"{attempt.context_score:.1f}/100"],
        ["Creativity", f"{attempt.creativity_score:.1f}/100"],
        ["Technical Depth", f"{attempt.technical_depth_score:.1f}/100"]
    ]
    score_table = Table(score_data, colWidths=[3*inch, 2*inch])
    score_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a73e8')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f9f9f9')])
    ]))
    story.append(score_table)
    story.append(Spacer(1, 0.3*inch))
    
    story.append(Paragraph("Strengths", heading_style))
    strengths_list = attempt.strengths.split(", ")
    for strength in strengths_list:
        story.append(Paragraph(f"• {strength}", normal_style))
    story.append(Spacer(1, 0.2*inch))
    
    story.append(Paragraph("Areas for Improvement", heading_style))
    weaknesses_list = attempt.weaknesses.split(", ")
    for weakness in weaknesses_list:
        story.append(Paragraph(f"• {weakness}", normal_style))
    story.append(Spacer(1, 0.2*inch))
    
    story.append(Paragraph("Suggestions", heading_style))
    suggestions_list = attempt.suggestions.split(", ")
    for suggestion in suggestions_list:
        story.append(Paragraph(f"• {suggestion}", normal_style))
    story.append(Spacer(1, 0.3*inch))
    
    story.append(PageBreak())
    story.append(Paragraph("AI-Improved Prompt", heading_style))
    story.append(Paragraph(attempt.ai_improved_prompt, normal_style))
    story.append(Spacer(1, 0.3*inch))
    
    story.append(Paragraph("XP Earned", heading_style))
    story.append(Paragraph(f"You earned {attempt.xp_earned} XP from this attempt!", normal_style))
    
    doc.build(story)
    return buffer
