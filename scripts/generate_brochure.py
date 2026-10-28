import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch

def generate_brochure():
    output_pdf = "assets/ClimbFit-Brochure-2026.pdf"
    os.makedirs("assets", exist_ok=True)
    
    page_width, page_height = 11 * inch, 6.1875 * inch # 16:9 ratio
    
    BG_DARK = colors.HexColor("#080810")
    SURFACE_DARK = colors.HexColor("#121222")
    SURFACE_RAISED = colors.HexColor("#18182c")
    BORDER_COLOR = colors.HexColor("#2a2a44")
    CYAN = colors.HexColor("#00e5ff")
    PINK = colors.HexColor("#ff4d8d")
    YELLOW = colors.HexColor("#f5d000")
    PURPLE = colors.HexColor("#b14fff")
    TEXT_WHITE = colors.HexColor("#f0f0fa")
    TEXT_MUTED = colors.HexColor("#9090aa")
    
    c = canvas.Canvas(output_pdf, pagesize=(page_width, page_height))
    
    def draw_bg(c, title="", category=""):
        c.setFillColor(BG_DARK)
        c.rect(0, 0, page_width, page_height, fill=1, stroke=0)
        
        # Subtle top gradient line
        c.setStrokeColor(CYAN)
        c.setLineWidth(2)
        c.line(0, page_height - 2, page_width, page_height - 2)
        
        # Footer
        c.setFillColor(TEXT_MUTED)
        c.setFont("Helvetica", 8)
        c.drawString(40, 22, "ClimbFit Technologies — 2026 Official Products & Infrastructure Brochure")
        c.drawRightString(page_width - 40, 22, "www.climbfit.in  |  contact@climbfit.in  |  +91 8982 789 640")
        
        if category:
            c.setFont("Helvetica-Bold", 8)
            c.setFillColor(YELLOW)
            c.drawString(40, page_height - 30, category.upper())
            
        if title:
            c.setFont("Helvetica-Bold", 20)
            c.setFillColor(TEXT_WHITE)
            c.drawString(40, page_height - 56, title)
            
    # Page 1: Cover
    draw_bg(c)
    if os.path.exists("assets/brand/logo.png"):
        c.drawImage("assets/brand/logo.png", 40, page_height - 80, width=140, height=40, preserveAspectRatio=True, mask='auto')
    
    c.setFont("Helvetica-Bold", 28)
    c.setFillColor(TEXT_WHITE)
    c.drawString(40, page_height - 150, "Interactive LED Climbing")
    c.drawString(40, page_height - 186, "Walls for Schools,")
    c.setFillColor(CYAN)
    c.drawString(40, page_height - 222, "Clubs & Commercial Gyms")
    
    c.setFont("Helvetica", 12)
    c.setFillColor(TEXT_MUTED)
    c.drawString(40, page_height - 265, "Products, Sizes, Turnkey Delivery & Technical Specifications · 2026")
    
    # Feature pill highlights
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(YELLOW)
    c.drawString(40, page_height - 305, "● ZERO-HARNESS SAFETY     ● SMART APP CONTROL     ● TURNKEY STAGES")
    
    # Cover image on the right
    if os.path.exists("assets/images/training-board.jpg"):
        img_x, img_y, img_w, img_h = page_width - 390, 42, 350, page_height - 84
        c.setStrokeColor(BORDER_COLOR)
        c.setLineWidth(1)
        c.roundRect(img_x, img_y, img_w, img_h, 8, stroke=1, fill=0)
        c.drawImage("assets/images/training-board.jpg", img_x, img_y, width=img_w, height=img_h, preserveAspectRatio=True)
    c.showPage()
    
    # Page 2: The Smart Infrastructure Solution
    draw_bg(c, "The Smart Infrastructure Solution", "Overview · 02")
    c.setFont("Helvetica", 11)
    c.setFillColor(CYAN)
    c.drawString(40, page_height - 80, "Transform any indoor wall into an interactive, app-controlled climbing arena.")
    
    c.setFont("Helvetica", 9.5)
    c.setFillColor(TEXT_MUTED)
    c.drawString(40, page_height - 105, "Traditional climbing walls require days of downtime and manual route-setting. ClimbFit combines modular")
    c.drawString(40, page_height - 120, "hardware, high-friction holds with integrated RGB LEDs, and intuitive app control on a single space footprint.")
    
    pillars = [
        ("Modular Engineered Wall", "Precision steel framework with high-grade Baltic birch panels and impact protection."),
        ("RGB LED Smart Hold Matrix", "Individually controlled hold illumination guiding climbers through 10,000+ routes."),
        ("Zero Physical Reset Downtime", "Switch difficulty grades, athletic drills, and youth games with a tap in the mobile app.")
    ]
    y = page_height - 170
    for title, desc in pillars:
        c.setFillColor(SURFACE_DARK)
        c.setStrokeColor(BORDER_COLOR)
        c.roundRect(40, y - 35, 420, 45, 6, fill=1, stroke=1)
        c.setFillColor(YELLOW)
        c.circle(58, y - 10, 4, fill=1, stroke=0)
        c.setFont("Helvetica-Bold", 10.5)
        c.setFillColor(TEXT_WHITE)
        c.drawString(72, y - 14, title)
        c.setFont("Helvetica", 8.5)
        c.setFillColor(TEXT_MUTED)
        c.drawString(72, y - 28, desc)
        y -= 54
        
    if os.path.exists("assets/images/media_1788251221312.jpg"):
        c.drawImage("assets/images/media_1788251221312.jpg", page_width - 280, 42, width=240, height=page_height - 120, preserveAspectRatio=True)
    c.showPage()
    
    # Page 3: ClimbFit Training Board & Sizes
    draw_bg(c, "ClimbFit Training Board & Configurations", "Our Products · 03")
    c.setFont("Helvetica", 10)
    c.setFillColor(TEXT_MUTED)
    c.drawString(40, page_height - 78, "Engineered steel frame, Baltic birch panels, sealed RGB LED holds, and custom dual-layer crash mats.")
    
    configs = [
        ("CONFIGURATION S", "8 × 12 ft", "198 Holds", "Residential clubs, boutique studios, compact school corners, private training setups.", CYAN),
        ("CONFIGURATION M", "12 × 12 ft", "270 Holds", "The versatile standard. Perfect for school athletic centers, commercial bouldering gyms.", YELLOW),
        ("CONFIGURATION L", "15 × 12 ft", "324 Holds", "Maximum training density. Multi-user capacity for universities, climbing teams, academies.", PINK)
    ]
    card_w = (page_width - 80 - 30) / 3
    card_h = 240
    y_card = 46
    
    for i, (size, dims, holds, desc, accent) in enumerate(configs):
        x = 40 + i * (card_w + 15)
        c.setFillColor(SURFACE_DARK)
        c.setStrokeColor(accent)
        c.setLineWidth(1.5)
        c.roundRect(x, y_card, card_w, card_h, 8, fill=1, stroke=1)
        
        c.setFillColor(SURFACE_RAISED)
        c.roundRect(x + 14, y_card + card_h - 32, 95, 18, 9, fill=1, stroke=0)
        c.setFillColor(accent)
        c.setFont("Helvetica-Bold", 8)
        c.drawString(x + 22, y_card + card_h - 20, size)
        
        c.setFont("Helvetica-Bold", 18)
        c.setFillColor(TEXT_WHITE)
        c.drawString(x + 14, y_card + card_h - 60, dims)
        
        c.setFont("Helvetica-Bold", 12)
        c.setFillColor(accent)
        c.drawString(x + 14, y_card + card_h - 80, holds)
        
        c.setStrokeColor(BORDER_COLOR)
        c.line(x + 14, y_card + card_h - 95, x + card_w - 14, y_card + card_h - 95)
        
        c.setFont("Helvetica", 8.5)
        c.setFillColor(TEXT_MUTED)
        words = desc.split()
        lines, cur = [], ""
        for w in words:
            if len(cur + " " + w) > 28:
                lines.append(cur)
                cur = w
            else:
                cur += " " + w if cur else w
        if cur: lines.append(cur)
        
        ly = y_card + card_h - 118
        for l in lines:
            c.drawString(x + 14, ly, l)
            ly -= 14
            
        c.setFont("Helvetica-Bold", 8)
        c.setFillColor(TEXT_WHITE)
        c.drawString(x + 14, y_card + 18, "✓ Dual-layer safety crash mats included")
    c.showPage()
    
    # Page 4: Schools & Institutions
    draw_bg(c, "Schools & Institutional Sports", "Who We Serve · 04")
    c.setFont("Helvetica", 10.5)
    c.setFillColor(YELLOW)
    c.drawString(40, page_height - 78, "Olympic-Level Youth Climbing Infrastructure with 100% Zero-Harness Safety")
    
    school_items = [
        ("100% Zero-Harness Safety", "Installed as low-height bouldering / traverse boards. No belaying, no rope gear, and zero heights anxiety."),
        ("PE & Athletic Curriculum Integration", "36-week structured lesson plans building functional core strength, coordination, and athletic agility."),
        ("Physical Chess (Cognitive Development)", "LED memory patterns, route visualization, and spatial problem-solving under physical exertion."),
        ("1-Term Campus Pilot Programme", "Complete turnkey deployment: certified safety padding, teacher training, pre-loaded games, and SLA.")
    ]
    for i, (title, desc) in enumerate(school_items):
        sy = page_height - 125 - i * 58
        c.setFillColor(SURFACE_DARK)
        c.setStrokeColor(BORDER_COLOR)
        c.roundRect(40, sy - 8, page_width - 80, 48, 6, fill=1, stroke=1)
        c.setFont("Helvetica-Bold", 11)
        c.setFillColor(TEXT_WHITE)
        c.drawString(60, sy + 20, f"0{i+1}.  {title}")
        c.setFont("Helvetica", 8.5)
        c.setFillColor(TEXT_MUTED)
        c.drawString(84, sy + 4, desc)
    c.showPage()
    
    # Page 5: Traverse Wall Systems
    draw_bg(c, "Continuous Traverse Walls", "Offerings · 05")
    c.setFont("Helvetica", 10.5)
    c.setFillColor(CYAN)
    c.drawString(40, page_height - 78, "Multi-User Low-Height Horizontal Climbing for Active Spaces & Corridors")
    
    if os.path.exists("assets/images/traverse-wall.jpg"):
        c.drawImage("assets/images/traverse-wall.jpg", page_width - 380, 44, width=340, height=page_height - 130, preserveAspectRatio=True)
        
    t_points = [
        ("Simultaneous Multi-User Flow", "Accommodates 4 to 8+ students or gym members traversing simultaneously side-by-side."),
        ("Low Ceiling Friendly", "Perfect for spaces with 8–10 ft ceiling limits; maximizes lateral wall square footage."),
        ("Modular Length Expansion", "Scales smoothly from 12 ft to 24, 36, 48+ ft lengths with continuous LED matrix."),
        ("Interactive Relays & Drills", "Pre-programmed with continuous loop endurance tracks and timed alphabet runs.")
    ]
    ty = page_height - 120
    for title, desc in t_points:
        c.setFillColor(SURFACE_DARK)
        c.setStrokeColor(BORDER_COLOR)
        c.roundRect(40, ty - 32, 360, 44, 6, fill=1, stroke=1)
        c.setFont("Helvetica-Bold", 10.5)
        c.setFillColor(YELLOW)
        c.drawString(55, ty - 8, title)
        c.setFont("Helvetica", 8)
        c.setFillColor(TEXT_MUTED)
        c.drawString(55, ty - 22, desc)
        ty -= 52
    c.showPage()
    
    # Page 6: Turnkey Solutions (6 Stages)
    draw_bg(c, "Turnkey Solutions — 6 Implementation Stages", "Delivery Process · 06")
    stages = [
        ("01", "Site Inspection", "Scan room clearance, structural wall integrity, power points, and floor safety boundaries."),
        ("02", "Design & Layout", "3D architectural model tailored to room dimensions, wall-mounted vs freestanding frames."),
        ("03", "Hardware Assembly", "Engineered steel frame, CNC plywood panels, sealed RGB LED harness, and controllers."),
        ("04", "Custom-Fitted Matting", "Fabrication of certified dual-layer high-density crash mats cut to exact room contours."),
        ("05", "App Calibration", "Pair iOS/Android tablets via Bluetooth/Wi-Fi, calibrate LED matrix, and sync route databases."),
        ("06", "Staff Onboarding", "Comprehensive training for physical educators and gym coaches on route creation & safety.")
    ]
    col_w = (page_width - 80 - 20) / 3
    for i, (num, stage_title, stage_desc) in enumerate(stages):
        col = i % 3
        row = i // 3
        sx = 40 + col * (col_w + 10)
        sy = page_height - 110 - row * 115 - 90
        
        c.setFillColor(SURFACE_DARK)
        c.setStrokeColor(BORDER_COLOR)
        c.roundRect(sx, sy, col_w, 95, 6, fill=1, stroke=1)
        
        c.setFont("Helvetica-Bold", 14)
        c.setFillColor(CYAN)
        c.drawString(sx + 14, sy + 68, num)
        c.setFont("Helvetica-Bold", 10.5)
        c.setFillColor(TEXT_WHITE)
        c.drawString(sx + 38, sy + 68, stage_title)
        
        c.setFont("Helvetica", 8)
        c.setFillColor(TEXT_MUTED)
        words = stage_desc.split()
        sl1, sl2 = "", ""
        for w in words:
            if len(sl1 + " " + w) < 32:
                sl1 += " " + w if sl1 else w
            else:
                sl2 += " " + w if sl2 else w
        c.drawString(sx + 14, sy + 44, sl1)
        if sl2: c.drawString(sx + 14, sy + 28, sl2)
    c.showPage()
    
    # Page 7: Installation & Maintenance Lifecycle
    draw_bg(c, "Installation & Maintenance Ecosystem", "Support · 07")
    m_items = [
        ("Turnkey Engineering Installation", "Professional non-destructive installation by certified structural technicians with zero downtime disruption."),
        ("Over-The-Air (OTA) Updates", "Firmware enhancements, bug fixes, and continuous route database expansions delivered directly via Wi-Fi."),
        ("Instant Self-Diagnostic Mode", "In-app automated diagnostic scan testing all LED nodes, current draw, and BLE transmitters in under 30 seconds."),
        ("Scheduled Safety & Padding Checks", "Annual certified assessment of crash mat foam resilience, anchor points, and hold fasteners."),
        ("Direct Support & Spare Modules", "Rapid priority dispatch of replacement hold shells, power supplies, and control units (+91 8982 789 640).")
    ]
    my = page_height - 115
    for title, desc in m_items:
        c.setFillColor(SURFACE_DARK)
        c.setStrokeColor(BORDER_COLOR)
        c.roundRect(40, my - 30, page_width - 80, 44, 6, fill=1, stroke=1)
        c.setFont("Helvetica-Bold", 10.5)
        c.setFillColor(YELLOW)
        c.drawString(55, my - 6, title)
        c.setFont("Helvetica", 8.5)
        c.setFillColor(TEXT_WHITE)
        c.drawString(55, my - 20, desc)
        my -= 52
    c.showPage()
    
    # Page 8: Contact & Download
    draw_bg(c, "Future-Proof Your Sports Infrastructure", "Contact & Next Steps · 08")
    c.setFont("Helvetica", 11)
    c.setFillColor(TEXT_MUTED)
    c.drawString(40, page_height - 80, "Explore customized ClimbFit configurations tailored to your space, room height, and athletic goals.")
    
    # Contact card
    c.setFillColor(SURFACE_DARK)
    c.setStrokeColor(CYAN)
    c.setLineWidth(1.5)
    c.roundRect(40, 60, page_width - 80, 180, 8, fill=1, stroke=1)
    
    c.setFont("Helvetica-Bold", 14)
    c.setFillColor(TEXT_WHITE)
    c.drawString(65, 205, "CONNECT WITH OUR SPORTS INFRASTRUCTURE SPECIALISTS")
    
    c.setFont("Helvetica", 10)
    c.setFillColor(TEXT_MUTED)
    c.drawString(65, 175, "Book a complimentary 3D site assessment, request architectural BIM drawings, or discuss campus pilot:")
    
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(YELLOW)
    c.drawString(65, 135, "PHONE:   +91 8982 789 640")
    c.setFillColor(CYAN)
    c.drawString(65, 105, "EMAIL:   contact@climbfit.in")
    c.setFillColor(TEXT_WHITE)
    c.drawString(65, 75, "WEB:     www.climbfit.in")
    
    c.showPage()
    c.save()
    print("Brochure successfully recompiled with graphics.")

if __name__ == "__main__":
    generate_brochure()
