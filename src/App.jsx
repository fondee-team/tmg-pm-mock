import LegacyApp from "./LegacyApp";
import React, { useState, useRef } from 'react';
import { 
  Search, ChevronDown, ChevronRight, Calendar, 
  Clock, Settings, PieChart, User, Plus, AlertTriangle, CalendarDays,
  Image as ImageIcon, Info, CheckSquare, Edit, X, ChevronLeft, Wrench, Layers,
  Check, RotateCcw, Activity, Sparkles, Droplet, Zap, Users,
  CheckCircle, AlertCircle, ShieldAlert, ClipboardCheck, History,
  Award, CheckCheck, Undo2, FileText, Trash2, Archive, Table, LayoutGrid, Sliders
} from 'lucide-react';

// ==========================================
// 1. MASTER DATA: SERVICE TYPES (ประเภทงานซ่อมบำรุง)
// ==========================================
const SERVICE_TYPES_CONFIG = {
  belt: { id: 'belt', name: 'งานสายพาน (Fan Belt)', shortName: 'สายพาน', icon: RotateCcw, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  motor: { id: 'motor', name: 'งานมอเตอร์/ตลับลูกปืน (Motor & Bearing)', shortName: 'มอเตอร์/แบริ่ง', icon: Activity, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  filter: { id: 'filter', name: 'งานล้างฟิลเตอร์ (Air Filter Cleaning)', shortName: 'ล้างฟิลเตอร์', icon: Sparkles, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  coil: { id: 'coil', name: 'งานล้างคอยล์เย็น (Cooling Coil Cleaning)', shortName: 'ล้างคอยล์', icon: Sparkles, color: 'text-teal-700 bg-teal-50 border-teal-200' },
  lubricant: { id: 'lubricant', name: 'งานอัดจารบี/หล่อลื่น (Lubrication)', shortName: 'อัดจารบี', icon: Droplet, color: 'text-cyan-700 bg-cyan-50 border-cyan-200' },
  electrical: { id: 'electrical', name: 'งานระบบไฟฟ้า/ขันแน่น (Electrical & Terminal)', shortName: 'ระบบไฟฟ้า', icon: Zap, color: 'text-purple-700 bg-purple-50 border-purple-200' },
  oil: { id: 'oil', name: 'งานเปลี่ยนถ่ายน้ำมันเครื่อง (Oil Change)', shortName: 'ถ่ายน้ำมันเครื่อง', icon: Droplet, color: 'text-rose-700 bg-rose-50 border-rose-200' },
  pump: { id: 'pump', name: 'งานแมคคานิคอลซีล/ใบพัด (Seal & Impeller)', shortName: 'ซีล/ใบพัด', icon: Wrench, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' }
};

const getServiceTypeInfo = (id) => SERVICE_TYPES_CONFIG[id] || SERVICE_TYPES_CONFIG.belt;

// ==========================================
// 2. MASTER DATA: อุปกรณ์แต่ละตัวมีประเภทงาน & Checklist เฉพาะตัวตามรอบ (1M / 6M / 1Y)
// ==========================================
const EQUIPMENT_PM_PROFILES = {
  // กลุ่ม AHU (Air Handling Unit)
  AHU: {
    category: "ระบบปรับอากาศ (HVAC)",
    type: "AHU (Air Handling Unit)",
    cycles: {
      '1M': {
        cycleLabel: 'ราย 1 เดือน (1M)',
        serviceTypeIds: ['filter', 'belt', 'electrical'],
        titleTemplate: 'ตรวจเช็คทำความสะอาดฟิลเตอร์และสายพาน AHU ประจำเดือน',
        checklist: [
          { id: 'ahu-1m-1', text: 'ตรวจเช็คการสั่นสะเทือนและเสียงผิดปกติขณะเดินเครื่อง', serviceTypeId: 'motor' },
          { id: 'ahu-1m-2', text: 'ถอดล้างทำความสะอาดแผ่นกรองอากาศ (Air Filter) และเป่าแห้ง', serviceTypeId: 'filter' },
          { id: 'ahu-1m-3', text: 'ตรวจเช็คสภาพสายพาน ความตึง และรอยแตกลายงา', serviceTypeId: 'belt' },
          { id: 'ahu-1m-4', text: 'วัดกระแสไฟฟ้า (Current R-S-T) และแรงดันไฟฟ้ามอเตอร์', serviceTypeId: 'electrical' },
          { id: 'ahu-1m-5', text: 'ตรวจเช็คการระบายน้ำของถาดน้ำทิ้ง ไม่ให้อุดตัน', serviceTypeId: 'filter' }
        ]
      },
      '6M': {
        cycleLabel: 'ราย 6 เดือน (6M)',
        serviceTypeIds: ['filter', 'belt', 'coil', 'motor', 'lubricant', 'electrical'],
        titleTemplate: 'ล้างคอยล์เย็น อัดจารบีลูกปืน และตรวจละเอียด AHU',
        checklist: [
          { id: 'ahu-6m-1', text: 'รวมงานตรวจเช็คตามรอบ 1 เดือน (1M) ทั้งหมด', serviceTypeId: 'filter' },
          { id: 'ahu-6m-2', text: 'ล้างทำความสะอาดคอยล์เย็น (Cooling Coil) ด้วยน้ำยาขจัดคราบและน้ำแรงดันต่ำ', serviceTypeId: 'coil' },
          { id: 'ahu-6m-3', text: 'อัดจารบีหล่อลื่นตลับลูกปืนเพลาพัดลมและมอเตอร์ (Bearing Lubrication)', serviceTypeId: 'lubricant' },
          { id: 'ahu-6m-4', text: 'ตรวจวัดค่าความเป็นฉนวนขดลวดมอเตอร์ (Megger Test)', serviceTypeId: 'motor' },
          { id: 'ahu-6m-5', text: 'ตรวจเช็คและกวดขันจุดต่อสายไฟในตู้คอนโทรล (Magnetic Contactor & Overload)', serviceTypeId: 'electrical' },
          { id: 'ahu-6m-6', text: 'ตรวจเช็คการทำงานของ Motorized Control Valve และ Actuator', serviceTypeId: 'electrical' }
        ]
      },
      '1Y': {
        cycleLabel: 'ราย 1 ปี (1Y)',
        serviceTypeIds: ['filter', 'belt', 'coil', 'motor', 'lubricant', 'electrical'],
        titleTemplate: 'โอเวอร์ฮอลใหญ่ เปลี่ยนสายพาน ปรับสมดุลใบพัด AHU ประจำปี',
        checklist: [
          { id: 'ahu-1y-1', text: 'รวมงานตรวจเช็ครอบ 1M และ 6M ทั้งหมด', serviceTypeId: 'coil' },
          { id: 'ahu-1y-2', text: 'เปลี่ยนชุดสายพานเส้นใหม่ครบชุดและตั้ง Alignment พูลเล่ย์', serviceTypeId: 'belt' },
          { id: 'ahu-1y-3', text: 'ตรวจเช็คสมดุลใบพัดลม (Dynamic Balance) และตรวจสภาพสนิมโครงสร้างภายใน', serviceTypeId: 'motor' },
          { id: 'ahu-1y-4', text: 'สอบเทียบเซนเซอร์วัดอุณหภูมิ ความชื้นสัมพัทธ์ และทดสอบ Fire Damper Interlock', serviceTypeId: 'electrical' }
        ]
      }
    }
  },
  // กลุ่ม Generator
  Generator: {
    category: "ระบบไฟฟ้า (Electrical)",
    type: "Generator",
    cycles: {
      '1M': {
        cycleLabel: 'ราย 1 เดือน (1M)',
        serviceTypeIds: ['oil', 'electrical'],
        titleTemplate: 'สตาร์ททดสอบเครื่องกำเนิดไฟฟ้า Generator ประจำเดือน',
        checklist: [
          { id: 'gen-1m-1', text: 'Run test เครื่องเปล่า (No-load) 15 นาที ตรวจเช็คเสียงและควันไอเสีย', serviceTypeId: 'motor' },
          { id: 'gen-1m-2', text: 'ตรวจวัดระดับน้ำมันเครื่องและแรงดันน้ำมันหล่อลื่น (Lube Oil Pressure)', serviceTypeId: 'oil' },
          { id: 'gen-1m-3', text: 'ตรวจเช็คแรงดันไฟแบตเตอรี่สตาร์ทเครื่องยนต์และระดับน้ำกลั่น', serviceTypeId: 'electrical' },
          { id: 'gen-1m-4', text: 'ตรวจเช็คระดับน้ำยาหล่อเย็นในหม้อน้ำ (Coolant Level) และสายพานหน้าเครื่อง', serviceTypeId: 'belt' }
        ]
      },
      '6M': {
        cycleLabel: 'ราย 6 เดือน (6M)',
        serviceTypeIds: ['oil', 'filter', 'electrical'],
        titleTemplate: 'เปลี่ยนถ่ายน้ำมันเครื่อง ไส้กรอง และทดสอบโหลด Generator',
        checklist: [
          { id: 'gen-6m-1', text: 'เปลี่ยนถ่ายน้ำมันเครื่องและเปลี่ยนไส้กรองน้ำมันเครื่องใหม่', serviceTypeId: 'oil' },
          { id: 'gen-6m-2', text: 'เปลี่ยนไส้กรองน้ำมันเชื้อเพลิงดีเซล (Fuel Filter)', serviceTypeId: 'filter' },
          { id: 'gen-6m-3', text: 'ทดสอบตัดต่อตู้สลับไฟอัตโนมัติ ATS (Automatic Transfer Switch)', serviceTypeId: 'electrical' },
          { id: 'gen-6m-4', text: 'ทดสอบเดินเครื่องพร้อมโหลดเสมือน (Dummy Load Test 30 นาที)', serviceTypeId: 'electrical' }
        ]
      },
      '1Y': {
        cycleLabel: 'ราย 1 ปี (1Y)',
        serviceTypeIds: ['oil', 'filter', 'electrical', 'motor'],
        titleTemplate: 'บำรุงรักษาใหญ่ เปลี่ยนถ่ายน้ำยาหล่อเย็น สอบเทียบเกจ Generator',
        checklist: [
          { id: 'gen-1y-1', text: 'ฟลัชชิ่งและเปลี่ยนถ่ายน้ำยาหล่อเย็นหม้อน้ำ (Coolant Replacement)', serviceTypeId: 'oil' },
          { id: 'gen-1y-2', text: 'ตรวจเช็คหัวฉีดน้ำมันและวาล์วเครื่องยนต์ดีเซล', serviceTypeId: 'motor' },
          { id: 'gen-1y-3', text: 'สอบเทียบมาตรวัดและเซนเซอร์ Safety Trip ทั้งหมด', serviceTypeId: 'electrical' }
        ]
      }
    }
  },
  // กลุ่ม Water Pump
  Pump: {
    category: "ระบบประปาและสุขาภิบาล (Plumbing)",
    type: "Water Pump",
    cycles: {
      '1M': {
        cycleLabel: 'ราย 1 เดือน (1M)',
        serviceTypeIds: ['pump', 'lubricant', 'electrical'],
        titleTemplate: 'ตรวจเช็คการรั่วซึม อัดจารบีปั๊มน้ำ Water Pump ประจำเดือน',
        checklist: [
          { id: 'pmp-1m-1', text: 'ตรวจเช็คการรั่วซึมของ Mechanical Seal หรือ Gland Packing', serviceTypeId: 'pump' },
          { id: 'pmp-1m-2', text: 'วัดอุณหภูมิและความสั่นสะเทือนของตลับลูกปืนหัว-ท้ายปั๊ม', serviceTypeId: 'motor' },
          { id: 'pmp-1m-3', text: 'อัดจารบีหล่อลื่นตลับลูกปืนปั๊มน้ำตามเกณฑ์มาตรฐาน', serviceTypeId: 'lubricant' },
          { id: 'pmp-1m-4', text: 'วัดกระแสไฟฟ้ามอเตอร์และแรงดันส่ง (Suction & Discharge Pressure)', serviceTypeId: 'electrical' }
        ]
      },
      '6M': {
        cycleLabel: 'ราย 6 เดือน (6M)',
        serviceTypeIds: ['pump', 'motor', 'electrical', 'lubricant'],
        titleTemplate: 'ตรวจเช็คคัปปลิ้ง ปรับ Alignment เพลาปั๊มน้ำ 6 เดือน',
        checklist: [
          { id: 'pmp-6m-1', text: 'รวมงานตรวจเช็คตามรอบ 1 เดือน (1M)', serviceTypeId: 'pump' },
          { id: 'pmp-6m-2', text: 'ตรวจสภาพยางคัปปลิ้ง (Flexible Coupling) และตั้ง Center เพลา', serviceTypeId: 'motor' },
          { id: 'pmp-6m-3', text: 'ตรวจเช็คการทำงานของ Check Valve และ Foot Valve กันน้ำย้อน', serviceTypeId: 'pump' },
          { id: 'pmp-6m-4', text: 'ขันแน่นน็อตยึดฐานแท่นปั๊มและโครงสร้างกันสะเทือน (Spring Isolator)', serviceTypeId: 'motor' }
        ]
      },
      '1Y': {
        cycleLabel: 'ราย 1 ปี (1Y)',
        serviceTypeIds: ['pump', 'motor', 'electrical'],
        titleTemplate: 'โอเวอร์ฮอลใบพัด ตรวจเปลี่ยนแมคคานิคอลซีลปั๊มน้ำประจำปี',
        checklist: [
          { id: 'pmp-1y-1', text: 'ถอดเปิดเสื้อปั๊มตรวจสภาพการกัดกร่อนของใบพัด (Impeller Inspection)', serviceTypeId: 'pump' },
          { id: 'pmp-1y-2', text: 'เปลี่ยนชุด Mechanical Seal และ O-Ring กันรั่วซึม', serviceTypeId: 'pump' },
          { id: 'pmp-1y-3', text: 'วัดค่าความเป็นฉนวนขดลวดมอเตอร์ปั๊มน้ำ (Megger Test)', serviceTypeId: 'electrical' }
        ]
      }
    }
  },
  // กลุ่ม Chiller
  Chiller: {
    category: "ระบบปรับอากาศ (HVAC)",
    type: "Chiller",
    cycles: {
      '1M': {
        cycleLabel: 'ราย 1 เดือน (1M)',
        serviceTypeIds: ['oil', 'electrical'],
        titleTemplate: 'ตรวจเช็คอุณหภูมิ แรงดันสารทำความเย็น และน้ำมันหล่อลื่น Chiller',
        checklist: [
          { id: 'ch-1m-1', text: 'ตรวจเช็คระดับน้ำมันหล่อลื่นคอมเพรสเซอร์และสีน้ำมันผ่านกระจกมอง (Sight Glass)', serviceTypeId: 'oil' },
          { id: 'ch-1m-2', text: 'จดบันทึกค่าอุณหภูมิน้ำเข้า-ออก Chilled Water (CHW) และ Condenser Water (CDW)', serviceTypeId: 'electrical' },
          { id: 'ch-1m-3', text: 'ตรวจเช็คแรงดันสารทำความเย็นด้าน High และ Low Pressure', serviceTypeId: 'pump' },
          { id: 'ch-1m-4', text: 'ตรวจเช็คประวัติ Alarm ในหน้าจอ Microprocessor Controller', serviceTypeId: 'electrical' }
        ]
      },
      '6M': {
        cycleLabel: 'ราย 6 เดือน (6M)',
        serviceTypeIds: ['oil', 'electrical', 'filter'],
        titleTemplate: 'ตรวจวิเคราะห์สภาพน้ำมัน ล้างทำความสะอาดแผงคอนเดนเซอร์ Chiller',
        checklist: [
          { id: 'ch-6m-1', text: 'เก็บตัวอย่างน้ำมันคอมเพรสเซอร์ส่งตรวจวิเคราะห์ความชื้นและความเป็นกรด', serviceTypeId: 'oil' },
          { id: 'ch-6m-2', text: 'ตรวจเช็คและทดสอบอุปกรณ์ Safety Device (High/Low Cut-out, Flow Switch)', serviceTypeId: 'electrical' },
          { id: 'ch-6m-3', text: 'ตรวจเช็คการทำงานของ Expansion Valve และ Sensor อุณหภูมิน้ำยา', serviceTypeId: 'electrical' }
        ]
      },
      '1Y': {
        cycleLabel: 'ราย 1 ปี (1Y)',
        serviceTypeIds: ['oil', 'filter', 'electrical'],
        titleTemplate: 'เปิดล้างท่อคอนเดนเซอร์ (Condenser Tube Cleaning) เปลี่ยนน้ำมันคอมเพรสเซอร์',
        checklist: [
          { id: 'ch-1y-1', text: 'เปิดฝา End Cover แยงล้างตะกรันในท่อทองแดงคอนเดนเซอร์ (Tube Brushing)', serviceTypeId: 'filter' },
          { id: 'ch-1y-2', text: 'เปลี่ยนถ่ายน้ำมันหล่อลื่นคอมเพรสเซอร์และเปลี่ยน Oil Filter', serviceTypeId: 'oil' },
          { id: 'ch-1y-3', text: 'กวดขันจุดต่อสายเมนไฟฟ้าขนาดใหญ่และตรวจวัดกระแสเต็มพิกัด (FLA)', serviceTypeId: 'electrical' }
        ]
      }
    }
  }
};

// Dynamic Registry สำหรับเครื่องจักรที่ถูกสร้างหรือแก้ไขใน Mock
const dynamicEquipmentProfilesRegistry = {};

// Helper: หา Profile ของเครื่องจักรตามชื่ออุปกรณ์
const getProfileForEquipment = (eqId) => {
  if (dynamicEquipmentProfilesRegistry[eqId]) return dynamicEquipmentProfilesRegistry[eqId];
  if (eqId.startsWith('AHU')) return EQUIPMENT_PM_PROFILES.AHU;
  if (eqId.startsWith('GEN')) return EQUIPMENT_PM_PROFILES.Generator;
  if (eqId.startsWith('PUMP')) return EQUIPMENT_PM_PROFILES.Pump;
  if (eqId.startsWith('CH')) return EQUIPMENT_PM_PROFILES.Chiller;
  return EQUIPMENT_PM_PROFILES.AHU;
};

// ==========================================
// 3. INITIAL MOCK DATA: PM TASKS (พร้อมสถานะ 5 สถานะ และผลประเมินสุขภาพ 3 หมวด)
// ==========================================
// สถานะ 5 สถานะ: 'รอดำเนินการ' | 'กำลังดำเนินการ' | 'รออนุมัติ' | 'ส่งกลับแก้ไข' | 'อนุมัติแล้ว'
// สุขภาพเครื่องจักร 3 หมวด: 'เรียบร้อย' | 'งานติดตาม' | 'งานซ่อมแซม'
const initialMockPMTasks = [
  {
    id: "PM-2026-001",
    date: '2026-07-11',
    equipment: 'AHU-01',
    cycle: '1M',
    title: 'ตรวจเช็คทำความสะอาดฟิลเตอร์และสายพาน AHU-01 ประจำเดือน',
    description: 'ถอดล้างฟิลเตอร์ เช็คความตึงสายพาน และวัดกระแสไฟ',
    status: 'รออนุมัติ', // 'รอดำเนินการ' | 'กำลังดำเนินการ' | 'รออนุมัติ' | 'ส่งกลับแก้ไข' | 'อนุมัติแล้ว'
    serviceTypeIds: ['filter', 'belt', 'electrical'],
    technicianHealthAssessment: 'เรียบร้อย', // ประเมินโดยช่าง: 'เรียบร้อย' | 'งานติดตาม' | 'งานซ่อมแซม'
    technicianNote: 'ทำความสะอาดฟิลเตอร์เรียบร้อย สายพานความตึงปกติ กระแสไฟ R:18A S:18A T:17.8A สภาพเครื่องทำงานสมบูรณ์',
    managerReviewNote: '',
    assignees: ['EMP สมชาย (ช่างแอร์)'],
    completedChecklistIds: ['ahu-1m-1', 'ahu-1m-2', 'ahu-1m-3', 'ahu-1m-4', 'ahu-1m-5'],
    workPhotos: [
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=300&h=200'
    ],
    timeline: [
      { status: 'รออนุมัติ', date: '11 ก.ค. 69', time: '11:15 น.', user: 'EMP สมชาย (ช่างแอร์)', comment: 'ส่งงานให้หัวหน้าแผนกตรวจสอบ พร้อมประเมินสุขภาพเครื่องจักร: [เรียบร้อย]' },
      { status: 'กำลังดำเนินการ', date: '11 ก.ค. 69', time: '09:30 น.', user: 'EMP สมชาย (ช่างแอร์)', comment: 'เริ่มดำเนินการตรวจเช็คและถอดล้างฟิลเตอร์' },
      { status: 'รอดำเนินการ', date: '10 ก.ค. 69', time: '08:00 น.', user: 'ระบบอัตโนมัติ', comment: 'สร้างกำหนดการตามรอบ 1 เดือน' }
    ]
  },
  {
    id: "PM-2026-002",
    date: '2026-07-11',
    equipment: 'AHU-03',
    cycle: '6M',
    title: 'ล้างคอยล์เย็น อัดจารบีลูกปืน และตรวจละเอียด AHU-03',
    description: 'ตรวจเช็คครบชุดรอบ 6 เดือน ล้างคอยล์และตรวจตู้คอนโทรล',
    status: 'ส่งกลับแก้ไข', // งานที่ถูกหัวหน้าส่งกลับ
    serviceTypeIds: ['filter', 'belt', 'coil', 'motor', 'lubricant', 'electrical'],
    technicianHealthAssessment: 'งานติดตาม',
    technicianNote: 'ล้างคอยล์เรียบร้อย อัดจารบีแล้ว แต่สังเกตว่าลูกปืนมีเสียงหอนเล็กน้อย',
    managerReviewNote: 'รูปถ่ายกระแสไฟมอเตอร์และเนมเพลทอ่านค่าไม่ชัดเจน รบกวนช่างไปถ่ายภาพหน้าปัดมิเตอร์และวัดอุณหภูมิแบริ่งส่งใหม่อีกครั้ง',
    assignees: ['EMP สมชาย (ช่างแอร์)', 'EMP วินัย (ผู้ช่วย)'],
    completedChecklistIds: ['ahu-6m-1', 'ahu-6m-2', 'ahu-6m-3', 'ahu-6m-4'],
    workPhotos: [
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=300&h=200'
    ],
    timeline: [
      { status: 'ส่งกลับแก้ไข', date: '11 ก.ค. 69', time: '13:00 น.', user: 'หัวหน้าแผนกวิศวกรรม', comment: 'ตีกลับแก้ไข: รูปถ่ายกระแสไฟและเนมเพลทไม่ชัดเจน ขอให้วัดอุณหภูมิลูกปืนส่งเพิ่ม' },
      { status: 'รออนุมัติ', date: '11 ก.ค. 69', time: '11:45 น.', user: 'EMP สมชาย (ช่างแอร์)', comment: 'ช่างส่งผลการตรวจรอบแรก ประเมินสุขภาพ: [งานติดตาม]' },
      { status: 'กำลังดำเนินการ', date: '11 ก.ค. 69', time: '09:00 น.', user: 'EMP สมชาย (ช่างแอร์)', comment: 'เข้าตรวจหน้างาน' }
    ]
  },
  {
    id: "PM-2026-003",
    date: '2026-07-11',
    equipment: 'GEN-01',
    cycle: '1M',
    title: 'สตาร์ททดสอบเครื่องกำเนิดไฟฟ้า Generator ประจำเดือน GEN-01',
    description: 'Run test no load 15 นาที และตรวจวัดระดับน้ำมันหล่อลื่น',
    status: 'อนุมัติแล้ว', // หัวหน้าอนุมัติปิดงานแล้ว
    serviceTypeIds: ['oil', 'electrical'],
    technicianHealthAssessment: 'เรียบร้อย',
    technicianNote: 'เครื่องสตาร์ทติดง่าย แรงดันน้ำมันเครื่อง 4.2 bar แบตเตอรี่ 25.8V ปกติ',
    managerReviewNote: 'ผลตรวจสมบูรณ์ ช่างแนบรูปหน้าปัดเกจและชั่วโมงการทำงานครบถ้วน อนุมัติปิดงาน',
    assignees: ['EMP สมหญิง (ช่างไฟ)'],
    completedChecklistIds: ['gen-1m-1', 'gen-1m-2', 'gen-1m-3', 'gen-1m-4'],
    workPhotos: [
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=300&h=200'
    ],
    timeline: [
      { status: 'อนุมัติแล้ว', date: '11 ก.ค. 69', time: '10:45 น.', user: 'หัวหน้าแผนกวิศวกรรม', comment: 'อนุมัติปิดงาน: ผลทดสอบสมบูรณ์ สภาพเครื่องเรียบร้อย 100%' },
      { status: 'รออนุมัติ', date: '11 ก.ค. 69', time: '10:15 น.', user: 'EMP สมหญิง (ช่างไฟ)', comment: 'ส่งงานให้ตรวจสอบ ประเมินสภาพ: [เรียบร้อย]' },
      { status: 'กำลังดำเนินการ', date: '11 ก.ค. 69', time: '09:30 น.', user: 'EMP สมหญิง (ช่างไฟ)', comment: 'เริ่มทดสอบ Run test เครื่องยนต์' }
    ]
  },
  {
    id: "PM-2026-004",
    date: '2026-07-11',
    equipment: 'PUMP-01',
    cycle: '1M',
    title: 'ตรวจเช็คการรั่วซึม อัดจารบีปั๊มน้ำ Water Pump PUMP-01',
    description: 'ตรวจเช็ค Mechanical Seal และอัดจารบีลูกปืน',
    status: 'กำลังดำเนินการ',
    serviceTypeIds: ['pump', 'lubricant', 'electrical'],
    technicianHealthAssessment: null, // กำลังดำเนินการ ยังไม่มีผลประเมินสุขภาพ
    technicianNote: 'อยู่ระหว่างตรวจเช็คซีลและอัดจารบีลูกปืน',
    managerReviewNote: '',
    assignees: ['EMP วินัย (ผู้ช่วย)'],
    completedChecklistIds: ['pmp-1m-1', 'pmp-1m-2'],
    workPhotos: [
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=300&h=200'
    ],
    timeline: [
      { status: 'กำลังดำเนินการ', date: '11 ก.ค. 69', time: '13:30 น.', user: 'EMP วินัย (ผู้ช่วย)', comment: 'เริ่มลงมือตรวจเช็คซีลและอัดจารบี' }
    ]
  },
  {
    id: "PM-2026-005",
    date: '2026-07-11',
    equipment: 'CH-01',
    cycle: '1M',
    title: 'ตรวจเช็คอุณหภูมิ แรงดันสารทำความเย็น CH-01',
    description: 'ตรวจเช็คระดับน้ำมันหล่อลื่นและแรงดันน้ำยาแอร์ Chiller',
    status: 'รอดำเนินการ',
    serviceTypeIds: ['oil', 'electrical'],
    technicianHealthAssessment: null, // รอดำเนินการ ยังไม่ได้เริ่มตรวจ
    technicianNote: '',
    managerReviewNote: '',
    assignees: ['EMP สมหญิง (ช่างไฟ)'],
    completedChecklistIds: [],
    workPhotos: [],
    timeline: [
      { status: 'รอดำเนินการ', date: '11 ก.ค. 69', time: '08:00 น.', user: 'ระบบอัตโนมัติ', comment: 'กำหนดงานเข้าตารางประจำวัน' }
    ]
  },
  // งานของวันที่ผ่านมา (10 ก.ค. 2569)
  {
    id: "PM-2026-006",
    date: '2026-07-10',
    equipment: 'AHU-02',
    cycle: '1M',
    title: 'ตรวจเช็คทำความสะอาดฟิลเตอร์ AHU-02',
    description: 'ล้างฟิลเตอร์และวัดกระแสไฟ',
    status: 'อนุมัติแล้ว',
    serviceTypeIds: ['filter', 'belt'],
    technicianHealthAssessment: 'เรียบร้อย',
    technicianNote: 'ล้างฟิลเตอร์เรียบร้อย เครื่องทำงานปกติ',
    managerReviewNote: 'อนุมัติปิดงานตามรอบ',
    assignees: ['EMP สมชาย (ช่างแอร์)'],
    completedChecklistIds: ['ahu-1m-1', 'ahu-1m-2', 'ahu-1m-3', 'ahu-1m-4', 'ahu-1m-5'],
    workPhotos: ['https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=300&h=200'],
    timeline: [{ status: 'อนุมัติแล้ว', date: '10 ก.ค. 69', time: '16:00 น.', user: 'หัวหน้าแผนกวิศวกรรม', comment: 'อนุมัติปิดงาน' }]
  },
  // งานของวันพรุ่งนี้ (12 ก.ค. 2569)
  {
    id: "PM-2026-007",
    date: '2026-07-12',
    equipment: 'PUMP-02',
    cycle: '1M',
    title: 'ตรวจเช็คการรั่วซึม อัดจารบีปั๊มน้ำ PUMP-02',
    description: 'ตรวจเช็คตามรอบสัปดาห์/เดือน',
    status: 'รอดำเนินการ',
    serviceTypeIds: ['pump', 'lubricant'],
    technicianHealthAssessment: null, // แผนล่วงหน้า ยังไม่ได้ตรวจ
    technicianNote: '',
    managerReviewNote: '',
    assignees: ['EMP วินัย (ผู้ช่วย)'],
    completedChecklistIds: [],
    workPhotos: [],
    timeline: [{ status: 'รอดำเนินการ', date: '11 ก.ค. 69', time: '17:00 น.', user: 'ระบบอัตโนมัติ', comment: 'เตรียมคิวงานล่วงหน้า' }]
  }
];

export default function App() {
  const [appVersion, setAppVersion] = useState('v2'); // 'v1' (เดิม) | 'v2' (ล่าสุด)
  const [currentView, setCurrentView] = useState('pm-list');
  const [userRole, setUserRole] = useState('manager'); // 'manager' (ผู้จัดการ) | 'technician' (ช่างหน้างาน) - แก้ไขข้อ 1.1
  const [pmViewMode, setPmViewMode] = useState('kanban'); // 'kanban' (รายวัน) | 'calendar' (รายเดือน)
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 6, 1)); // Default July 2026
  
  // Equipment Management States (เพิ่ม/แก้ไข/ลบ Soft Delete และดูประวัติ)
  const [equipmentsList, setEquipmentsList] = useState([
    { id: "AHU-01", profileKey: "AHU", category: "ระบบปรับอากาศ (HVAC)", type: "AHU (Air Handling Unit)", location: "ชั้น B1 โซน A", interval: "รายเดือน", isArchived: false },
    { id: "AHU-02", profileKey: "AHU", category: "ระบบปรับอากาศ (HVAC)", type: "AHU (Air Handling Unit)", location: "ชั้น 2 โซน B", interval: "รายเดือน", isArchived: false },
    { id: "AHU-03", profileKey: "AHU", category: "ระบบปรับอากาศ (HVAC)", type: "AHU (Air Handling Unit)", location: "ชั้น 4 โซน Food Hall", interval: "รายเดือน", isArchived: false },
    { id: "GEN-01", profileKey: "Generator", category: "ระบบไฟฟ้า (Electrical)", type: "Generator", location: "ชั้น B2 ห้องเครื่องกำเนิดไฟ", interval: "รายเดือน", isArchived: false },
    { id: "PUMP-01", profileKey: "Pump", category: "ระบบประปาและสุขาภิบาล (Plumbing)", type: "Water Pump", location: "ชั้น B2 ห้องปั๊มน้ำดี", interval: "รายสัปดาห์", isArchived: false },
    { id: "PUMP-02", profileKey: "Pump", category: "ระบบประปาและสุขาภิบาล (Plumbing)", type: "Water Pump", location: "ชั้น ดาดฟ้า Booster Pump", interval: "รายสัปดาห์", isArchived: false },
    { id: "CH-01", profileKey: "Chiller", category: "ระบบปรับอากาศ (HVAC)", type: "Chiller", location: "ชั้น B3 Plant Room", interval: "ราย3เดือน", isArchived: false },
    { id: "MDB-01", profileKey: "Generator", category: "ระบบไฟฟ้า (Electrical)", type: "MDB (Main Distribution Board)", location: "ชั้น B1 ห้องไฟฟ้า", interval: "รายปี", isArchived: false }
  ]);
  const [searchEq, setSearchEq] = useState("");
  const [eqViewMode, setEqViewMode] = useState('card'); // 'card' | 'table' - แก้ไขข้อ 3.1
  const [showArchivedSection, setShowArchivedSection] = useState(true);
  const [showDeleteEqModal, setShowDeleteEqModal] = useState(false);
  const [eqToDelete, setEqToDelete] = useState(null);

  // Kanban Technician Multi-Select & Search
  const [selectedKanbanTechs, setSelectedKanbanTechs] = useState([]); // [] = แสดงทุกคน
  const [isKanbanTechDropdownOpen, setIsKanbanTechDropdownOpen] = useState(false);
  const [kanbanTechSearch, setKanbanTechSearch] = useState("");
  const [showReassignModal, setShowReassignModal] = useState(false); // Modal มอบหมาย/เปลี่ยนช่าง
  const [taskToReassign, setTaskToReassign] = useState(null);
  const [newAssigneeName, setNewAssigneeName] = useState("EMP สมชาย (ช่างแอร์)");

  const techniciansList = [
    { name: "EMP สมชาย (ช่างแอร์)", role: "ช่างระบบปรับอากาศ", avatar: "SC", color: "from-blue-600 to-indigo-600" },
    { name: "EMP สมหญิง (ช่างไฟ)", role: "ช่างระบบไฟฟ้า", avatar: "SY", color: "from-purple-600 to-pink-600" },
    { name: "EMP วินัย (ผู้ช่วย)", role: "ช่างสุขาภิบาล/ทั่วไป", avatar: "WN", color: "from-amber-600 to-orange-600" }
  ];
  const [selectedEqCategory, setSelectedEqCategory] = useState("all");
  const [showAddEditEqModal, setShowAddEditEqModal] = useState(false);
  const [editingEq, setEditingEq] = useState(null);
  const [eqFormId, setEqFormId] = useState("");
  const [eqFormCategory, setEqFormCategory] = useState("ระบบปรับอากาศ (HVAC)");
  const [eqFormType, setEqFormType] = useState("AHU (Air Handling Unit)"); // แก้ไข Error ตัวแปรไม่ถูกประกาศ
  const [eqFormLocation, setEqFormLocation] = useState("");
  const [eqFormInterval, setEqFormInterval] = useState("รายเดือน");
  // ตั้งค่ารอบซ่อมบำรุงในอุปกรณ์ (เลือกได้ทั้ง 1M, 6M, 1Y ไม่จำเป็นต้องครบทั้ง 3)
  const [eqCyclesConfig, setEqCyclesConfig] = useState({
    "1M": { enabled: true, serviceTypeIds: ["filter", "belt", "electrical"], checklistStr: "ตรวจเช็คการสั่นสะเทือนและเสียงผิดปกติ\nทำความสะอาดฟิลเตอร์\nเช็คความตึงสายพาน\nวัดกระแสไฟฟ้า" },
    "6M": { enabled: true, serviceTypeIds: ["coil", "motor", "lubricant"], checklistStr: "ล้างคอยล์เย็น\nอัดจารบีแบริ่งลูกปืน\nMegger Test มอเตอร์" },
    "1Y": { enabled: false, serviceTypeIds: ["belt", "motor", "electrical"], checklistStr: "เปลี่ยนสายพานชุดใหม่\nตรวจสมดุลใบพัดลม\nสอบเทียบเซนเซอร์" }
  });
  const [pmTasks, setPmTasks] = useState(initialMockPMTasks);
  const [selectedPMTask, setSelectedPMTask] = useState(initialMockPMTasks[0]);

  // Accordion Section วันที่ในหน้ารายการ PM (Default: เปิดเฉพาะวันปัจจุบัน 2026-07-11)
  const [openDateSections, setOpenDateSections] = useState({
    '2026-07-11': true, // เปิดวันปัจจุบัน
    '2026-07-12': false,
    '2026-07-10': false
  });

  // Modal States
  const [showManagerApprovalModal, setShowManagerApprovalModal] = useState(false);
  const [managerActionType, setManagerActionType] = useState('approve'); // 'approve' | 'reject'
  const [managerInputNote, setManagerInputNote] = useState('');
  
  // ช่างและผู้จัดการบันทึกผลการตรวจ & ปรับสถานะ (UI ตรงตาม Mockup จริง)
  const [showTechSubmitModal, setShowTechSubmitModal] = useState(false);
  const [techFormTargetStatus, setTechFormTargetStatus] = useState('กำลังดำเนินการ'); // 'รอดำเนินการ' | 'กำลังดำเนินการ' | 'รออนุมัติ'
  const [techFormHealth, setTechFormHealth] = useState('เรียบร้อย'); // 'เรียบร้อย' | 'งานติดตาม' | 'งานซ่อมแซม'
  const [techFormNote, setTechFormNote] = useState('');
  const [techFormCoWorkers, setTechFormCoWorkers] = useState([]);
  const [techFormWorkTypes, setTechFormWorkTypes] = useState(['ซ่อมบำรุง']);
  const [techFormPhotos, setTechFormPhotos] = useState([]);
  const techPhotoInputRef = useRef(null);

  // Helper สำหรับเปิด Modal ปรับสถานะงาน (ใช้ได้ทั้งผู้จัดการและช่าง ตามข้อ 10.1)
  const openStatusUpdateModal = (task) => {
    let defaultTarget = task.status;
    if (task.status === 'รอดำเนินการ') defaultTarget = 'กำลังดำเนินการ';
    else if (task.status === 'กำลังดำเนินการ') defaultTarget = 'รออนุมัติ';
    
    setTechFormTargetStatus(defaultTarget);
    setTechFormHealth(task.technicianHealthAssessment || 'เรียบร้อย');
    setTechFormNote(task.technicianNote || '');
    setTechFormCoWorkers(task.coWorkers || (task.assignees ? task.assignees.slice(1) : []));
    setTechFormWorkTypes(task.workTypes || ['ซ่อมบำรุง']);
    setTechFormPhotos(task.workPhotos ? [...task.workPhotos] : []);
    setShowTechSubmitModal(true);
  };

  // ฟอร์มสร้างงาน PM ของหัวหน้าแผนก (Lean UX)
  const [createPM_equipment, setCreatePM_equipment] = useState('AHU-01');
  const [createPM_cycle, setCreatePM_cycle] = useState('1M');
  const [createPM_date, setCreatePM_date] = useState('2026-07-11');
  const [createPM_assignee, setCreatePM_assignee] = useState('EMP สมชาย (ช่างแอร์)');
  const [createPM_customTitle, setCreatePM_customTitle] = useState('');

  // Equipment List View State
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  // สถิติ: ตัวกรองช่วงเวลา - ค่าตั้งต้นเป็น 'monthly' รายเดือน (แก้ไขข้อ 2.2 เพื่อลดความสับสน)
  const [statsTimeMode, setStatsTimeMode] = useState('monthly'); // 'monthly' | 'daily'
  const [statsMonth, setStatsMonth] = useState('2026-07'); // Default July 2026
  const [statsDate, setStatsDate] = useState('2026-07-11'); // Default 11 ก.ค. 2569 (วันนี้)
  const [selectedStatsTechs, setSelectedStatsTechs] = useState([]); // [] = ช่างทุกคน
  const [isStatsTechDropdownOpen, setIsStatsTechDropdownOpen] = useState(false);
  const [statsTechSearch, setStatsTechSearch] = useState("");

  // Data สำหรับหน้าสถิติที่ผ่านการกรอง (มีผลต่อทุก Section ในหน้าสถิติตาม UX ที่ขอ)
  const filteredStatsTasks = pmTasks.filter(task => {
    // 1. กรองตามช่วงเวลา (รายเดือน หรือ รายวัน)
    if (statsTimeMode === 'monthly') {
      if (!task.date.startsWith(statsMonth)) return false;
    } else {
      if (task.date !== statsDate) return false;
    }

    // 2. กรองตามช่าง (Multi-Select)
    if (selectedStatsTechs.length > 0) {
      const isAssigned = task.assignees?.some(a => selectedStatsTechs.includes(a));
      if (!isAssigned) return false;
    }

    return true;
  });

  // Helper ดึง Checklist ปัจจุบันของใบงาน
  const getTaskChecklist = (task) => {
    const profile = getProfileForEquipment(task.equipment);
    const cycleData = profile.cycles[task.cycle] || profile.cycles['1M'];
    return cycleData.checklist;
  };

  // Toggle Section วันที่
  const toggleDateSection = (dateKey) => {
    setOpenDateSections(prev => ({
      ...prev,
      [dateKey]: !prev[dateKey]
    }));
  };

  // ติ๊ก Checkbox แต่ละข้อ (กดได้เฉพาะสถานะ "กำลังดำเนินการ" เท่านั้น และการติ๊กจะไม่เปลี่ยนสถานะใบงาน ตามข้อ 10.2 & 10.3)
  const handleToggleChecklistItem = (itemId) => {
    if (!selectedPMTask || selectedPMTask.status !== 'กำลังดำเนินการ') return;
    const currentList = selectedPMTask.completedChecklistIds || [];
    const isCompleted = currentList.includes(itemId);
    const updatedList = isCompleted 
      ? currentList.filter(id => id !== itemId)
      : [...currentList, itemId];

    const updatedTask = {
      ...selectedPMTask,
      // คงสถานะเดิม ไม่เปลี่ยนสถานะอัตโนมัติเมื่อติ๊ก Checklist ตามข้อ 10.2
      completedChecklistIds: updatedList
    };

    setSelectedPMTask(updatedTask);
    setPmTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  // บันทึกการปรับสถานะและส่งงาน (รองรับทั้งผู้จัดการและช่าง ตามข้อ 10.1 & 10.5)
  const handleTechnicianSubmit = () => {
    const isSubmittingForReview = techFormTargetStatus === 'รออนุมัติ';
    const updatedHealth = isSubmittingForReview ? techFormHealth : (techFormTargetStatus === 'กำลังดำเนินการ' ? null : selectedPMTask.technicianHealthAssessment);

    const currentUser = userRole === 'manager' 
      ? 'ผู้จัดการแผนก (Manager)' 
      : (selectedPMTask.assignees[0] || 'ช่างเทคนิค');

    const updatedTask = {
      ...selectedPMTask,
      status: techFormTargetStatus,
      technicianHealthAssessment: updatedHealth,
      technicianNote: techFormNote || selectedPMTask.technicianNote,
      coWorkers: techFormCoWorkers,
      workTypes: techFormWorkTypes,
      workPhotos: techFormPhotos,
      timeline: [
        {
          status: techFormTargetStatus,
          date: '11 ก.ค. 69',
          time: 'ขณะนี้',
          user: currentUser,
          comment: isSubmittingForReview
            ? `ส่งผลการตรวจเช็คตาม Checklist ให้หัวหน้าอนุมัติ พร้อมประเมินสุขภาพเครื่องจักร: [${techFormHealth}] - ${techFormNote || 'ตรวจครบถ้วน'}`
            : `ปรับสถานะเป็น [${techFormTargetStatus}] - ${techFormNote || 'บันทึกการปรับปรุงสถานะ'}`
        },
        ...selectedPMTask.timeline
      ]
    };
    setSelectedPMTask(updatedTask);
    setPmTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setShowTechSubmitModal(false);
  };

  // หัวหน้าแผนกอนุมัติ หรือ ตีกลับแก้ไข
  const handleManagerDecision = () => {
    const isApproved = managerActionType === 'approve';
    const newStatus = isApproved ? 'อนุมัติแล้ว' : 'ส่งกลับแก้ไข';

    const updatedTask = {
      ...selectedPMTask,
      status: newStatus,
      managerReviewNote: managerInputNote || (isApproved ? 'อนุมัติปิดงานเรียบร้อย' : 'ส่งกลับให้ตรวจสอบแก้ไขเพิ่มเติม'),
      timeline: [
        {
          status: newStatus,
          date: '11 ก.ค. 69',
          time: 'ขณะนี้',
          user: 'หัวหน้าแผนกวิศวกรรมอาคาร',
          comment: isApproved 
            ? `อนุมัติปิดงาน: ยืนยันผลการตรวจและสุขภาพเครื่องจักร [${selectedPMTask.technicianHealthAssessment}] หมายเหตุ: ${managerInputNote || 'เรียบร้อย'}`
            : `ส่งกลับแก้ไข: ตรวจพบข้อบกพร่อง - ${managerInputNote || 'ขอให้แนบข้อมูลเพิ่มเติม'}`
        },
        ...selectedPMTask.timeline
      ]
    };

    setSelectedPMTask(updatedTask);
    setPmTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setShowManagerApprovalModal(false);
    setManagerInputNote('');
  };

  // สร้างงาน PM ใหม่ (Lean UX)
  const handleCreateNewPMTask = () => {
    const profile = getProfileForEquipment(createPM_equipment);
    const cycleData = profile.cycles[createPM_cycle] || profile.cycles['1M'];
    const newId = `PM-2026-${String(pmTasks.length + 1).padStart(3, '0')}`;
    const newTaskTitle = createPM_customTitle.trim() || createPM_equipment;

    const newTask = {
      id: newId,
      date: createPM_date,
      equipment: createPM_equipment,
      cycle: createPM_cycle,
      title: newTaskTitle,
      description: `การบำรุงรักษาเชิงป้องกันตามรอบ ${cycleData.cycleLabel}`,
      status: 'รอดำเนินการ',
      serviceTypeIds: cycleData.serviceTypeIds,
      technicianHealthAssessment: null,
      technicianNote: '',
      managerReviewNote: '',
      assignees: [createPM_assignee],
      completedChecklistIds: [],
      workPhotos: [],
      timeline: [
        { status: 'รอดำเนินการ', date: '11 ก.ค. 69', time: 'ขณะนี้', user: 'หัวหน้าแผนกวิศวกรรม', comment: `สร้างงานมอบหมายรอบ ${cycleData.cycleLabel}` }
      ]
    };

    setPmTasks(prev => [newTask, ...prev]);
    setSelectedPMTask(newTask);
    setCurrentView('pm-detail');
  };

  // Render Sidebar
  // ฟังก์ชันวาดตารางปฏิทินรายเดือน (Monthly Calendar Grid)
  const renderMonthlyCalendarGrid = () => {
    const days = [];
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="bg-gray-50/50 min-h-[110px] p-2 opacity-40 border border-gray-100"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      const dayTasks = pmTasks.filter(task => task.date === dateStr);
      const isToday = dateStr === "2026-07-11";
      const pendingCount = dayTasks.filter(t => t.status === "รอดำเนินการ" || t.status === "กำลังดำเนินการ").length;
      const reviewCount = dayTasks.filter(t => t.status === "รออนุมัติ").length;
      const doneCount = dayTasks.filter(t => t.status === "อนุมัติแล้ว").length;
      const reworkCount = dayTasks.filter(t => t.status === "ส่งกลับแก้ไข").length;

      days.push(
        <div 
          key={i} 
          onClick={() => {
            if (dayTasks.length > 0) {
              setOpenDateSections(prev => ({ ...prev, [dateStr]: true }));
              setPmViewMode("kanban");
            }
          }}
          className={`min-h-[110px] bg-white border border-gray-100 p-2 flex flex-col justify-between hover:bg-blue-50/40 transition-colors cursor-pointer group relative ${isToday ? "ring-2 ring-blue-500 bg-blue-50/20" : ""}`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${isToday ? "bg-blue-600 text-white" : "text-gray-700"}`}>
              {i}
            </span>
            {dayTasks.length > 0 && (
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                {dayTasks.length} งาน
              </span>
            )}
          </div>

          <div className="space-y-1">
            {reworkCount > 0 && (
              <div className="text-xs bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-bold truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                <span>ส่งกลับ: {reworkCount}</span>
              </div>
            )}
            {reviewCount > 0 && (
              <div className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                <span>รอตรวจ: {reviewCount}</span>
              </div>
            )}
            {pendingCount > 0 && (
              <div className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span>รอทำ: {pendingCount}</span>
              </div>
            )}
            {doneCount > 0 && (
              <div className="text-xs bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span>อนุมัติ: {doneCount}</span>
              </div>
            )}
          </div>

          {dayTasks.length > 0 && (
            <div className="text-xs text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity text-right mt-1">
              เปิดดู Kanban &rarr;
            </div>
          )}
        </div>
      );
    }
    return days;
  };

  const renderSidebar = () => (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 select-none overflow-y-auto">
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
            T
          </div>
          <div>
            <span className="font-bold text-gray-800 text-sm block leading-tight">The Mall Group</span>
            <span className="text-xs text-gray-400">Emporium FM System</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-6">
        {/* เมนูหลัก: จัดการงาน PM */}
        <div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">งานซ่อมบำรุง (PM)</div>
          <div className="space-y-1">
            <div 
              onClick={() => setCurrentView('pm-list')}
              className={`p-3 text-sm rounded-xl cursor-pointer font-medium flex items-center justify-between transition-colors ${currentView === 'pm-list' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <div className="flex items-center gap-2.5">
                <CalendarDays className={`w-4 h-4 ${currentView === 'pm-list' ? 'text-white' : 'text-blue-500'}`} />
                <span>รายการ PM</span>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${currentView === 'pm-list' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'}`}>{pmTasks.length}</span>
            </div>

            <div 
              onClick={() => setCurrentView('pm-monthly-summary')}
              className={`p-3 text-sm rounded-xl cursor-pointer font-medium flex items-center justify-between transition-colors ${currentView === 'pm-monthly-summary' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <div className="flex items-center gap-2.5">
                <PieChart className={`w-4 h-4 ${currentView === 'pm-monthly-summary' ? 'text-white' : 'text-emerald-500'}`} />
                <span>สถิติ</span>
              </div>
            </div>

            <div 
              onClick={() => setCurrentView('pm-equipment')}
              className={`p-3 text-sm rounded-xl cursor-pointer font-medium flex items-center justify-between transition-colors ${currentView === 'pm-equipment' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className={`w-4 h-4 ${currentView === 'pm-equipment' ? 'text-white' : 'text-purple-500'}`} />
                <span>รายการอุปกรณ์</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Footer (แสดงตามบทบาทที่สวมอยู่ - แก้ไขข้อ 1.1) */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center gap-3">
        <div className={`w-9 h-9 rounded-full ${userRole === 'manager' ? 'bg-blue-600' : 'bg-emerald-600'} text-white flex items-center justify-center font-bold text-xs shadow-xs`}>
          {userRole === 'manager' ? 'ผจก.' : 'ช่าง'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-gray-900 truncate">
            {userRole === 'manager' ? 'หัวหน้าแผนกวิศวกรรม' : 'EMP สมชาย (ช่างแอร์)'}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {userRole === 'manager' ? 'อนุมัติปิดงาน & มอบหมายงาน' : 'ตรวจเช็คหน้างาน & ส่งงาน'}
          </div>
        </div>
      </div>
    </aside>
  );

  if (appVersion === "v1") {
    return <LegacyApp onSwitchVersion={() => setAppVersion("v2")} />;
  }

  return (
    <div className="flex h-screen bg-[#f3f4f6] font-sans text-gray-800">
      {renderSidebar()}

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 bg-white border-b border-gray-200 z-10 sticky top-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-gray-900 text-base">ระบบตรวจและบริหารงานบำรุงรักษาเชิงป้องกัน (TMG-PM)</span>
            
            {/* Version Switcher Pill */}
            <div className="bg-gray-100 p-1 rounded-xl flex items-center border border-gray-200 text-xs shadow-2xs">
              <button 
                onClick={() => setAppVersion('v1')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${appVersion === 'v1' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Version เดิม (ก่อนวันนี้)
              </button>
              <button 
                onClick={() => setAppVersion('v2')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${appVersion === 'v2' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Version ล่าสุด
              </button>
            </div>

            {/* Role Switcher Pill (แก้ไขข้อ 1.1: แยกบทบาท ช่างหน้างาน vs ผู้จัดการ) */}
            <div className="bg-gray-100 p-1 rounded-xl flex items-center border border-gray-200 text-xs shadow-2xs">
              <span className="text-[11px] font-bold text-gray-500 px-2 flex items-center gap-1">
                สวมบทบาท:
              </span>
              <button 
                type="button"
                onClick={() => setUserRole('manager')}
                className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${userRole === 'manager' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                ผู้จัดการ (ผจก.)
              </button>
              <button 
                type="button"
                onClick={() => setUserRole('technician')}
                className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${userRole === 'technician' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <User className="w-3.5 h-3.5" />
                ช่างหน้างาน
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentView('pm-create')}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold shadow-sm"
            >
              <Plus className="w-4 h-4" /> สร้างงาน PM ใหม่
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* ======================================================== */}
          {/* VIEW 1: PM LIST (รองรับสลับมุมมอง รายวัน Kanban / รายเดือน Calendar) */}
          {/* ======================================================== */}
          {currentView === 'pm-list' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {pmViewMode === 'kanban' ? "กระดานติดตามงาน PM ประจำวัน (Daily Kanban)" : "ปฏิทินงาน PM รายเดือน (Monthly Calendar View)"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {pmViewMode === 'kanban' 
                      ? "Section ตามวันที่ (Default: เปิดเฉพาะวันปัจจุบัน) พร้อม Kanban 5 สถานะ: รอดำเนินการ, กำลังดำเนินการ, รออนุมัติ, ส่งกลับแก้ไข, อนุมัติแล้ว"
                      : "มุมมองปฏิทินรายเดือน แสดงภาพรวมรอบการตรวจเช็คและการกระจายตัวของใบงาน PM ทั้งเดือน"}
                  </p>
                </div>

                {/* View Switcher: รายวัน (Kanban) vs รายเดือน (Calendar) */}
                <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-gray-200 shadow-xs shrink-0">
                  <button 
                    onClick={() => setPmViewMode('kanban')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${pmViewMode === 'kanban' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <CalendarDays className="w-4 h-4" />
                    <span>มุมมองรายวัน (Kanban)</span>
                  </button>
                  <button 
                    onClick={() => setPmViewMode('calendar')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${pmViewMode === 'calendar' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>มุมมองรายเดือน (Calendar)</span>
                  </button>
                </div>
              </div>

              {/* กรณีเลือกมุมมองรายเดือน: แสดง Monthly Calendar View */}
              {pmViewMode === 'calendar' && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 animate-in fade-in duration-200">
                   <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                         <h3 className="font-bold text-gray-900 text-lg">
                           {calendarMonth.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })} ({calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})
                         </h3>
                         <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-bold border border-blue-200">
                            รวม {pmTasks.length} ใบงานในเดือนนี้
                         </span>
                      </div>
                      <div className="flex gap-2">
                         <button 
                           onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                           className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600"
                           title="เดือนก่อนหน้า"
                         >
                           <ChevronLeft className="w-4 h-4" />
                         </button>
                         <button 
                           onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                           className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600"
                           title="เดือนถัดไป"
                         >
                           <ChevronRight className="w-4 h-4" />
                         </button>
                      </div>
                   </div>

                   <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-2xl overflow-hidden text-center text-xs font-bold text-gray-600">
                      <div className="bg-gray-50 py-3 text-red-500">อาทิตย์</div>
                      <div className="bg-gray-50 py-3">จันทร์</div>
                      <div className="bg-gray-50 py-3">อังคาร</div>
                      <div className="bg-gray-50 py-3">พุธ</div>
                      <div className="bg-gray-50 py-3">พฤหัสบดี</div>
                      <div className="bg-gray-50 py-3">ศุกร์</div>
                      <div className="bg-gray-50 py-3 text-blue-500">เสาร์</div>
                      {renderMonthlyCalendarGrid()}
                   </div>
                </div>
              )}

              {/* กรณีเลือกมุมมองรายวัน (Kanban): แสดงแถบกรองช่างกะทัดรัด + Accordion รายวัน */}
              {pmViewMode === 'kanban' && (
                <div className="space-y-6">
                  {/* แถบกรองช่าง Searchable Multi-Select ประจำกระดาน Kanban พร้อมลิงก์ไปดูสถิติฉบับเต็ม */}
                  <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-20">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-xs font-bold text-gray-500 shrink-0 flex items-center gap-1.5 pl-1">
                        <Users className="w-4 h-4 text-blue-600" /> ช่างผู้รับผิดชอบ:
                      </span>

                      {/* Dropdown Multi-Select with Search */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsKanbanTechDropdownOpen(prev => !prev)}
                          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-2xs ${selectedKanbanTechs.length > 0 ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                        >
                          <Search className="w-3.5 h-3.5 text-gray-400" />
                          <span>
                            {selectedKanbanTechs.length === 0 
                              ? `ช่างทุกคน (${techniciansList.length} คน)` 
                              : selectedKanbanTechs.length === 1 
                                ? selectedKanbanTechs[0].split(' ')[1] 
                                : `เลือก ${selectedKanbanTechs.length} คน`}
                          </span>
                          <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isKanbanTechDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Popover */}
                        {isKanbanTechDropdownOpen && (
                          <>
                            <div 
                              className="fixed inset-0 z-40" 
                              onClick={() => setIsKanbanTechDropdownOpen(false)} 
                            />
                            <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 p-3 space-y-2.5 animate-in fade-in duration-150">
                              {/* Search Input */}
                              <div className="relative">
                                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                                <input
                                  type="text"
                                  value={kanbanTechSearch}
                                  onChange={(e) => setKanbanTechSearch(e.target.value)}
                                  placeholder="ค้นหาชื่อ หรือตำแหน่งช่าง..."
                                  className="w-full pl-8 pr-7 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                  autoFocus
                                />
                                {kanbanTechSearch && (
                                  <button 
                                    onClick={() => setKanbanTechSearch('')} 
                                    className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 text-xs"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex items-center justify-between text-[11px] px-1 pb-1 border-b border-gray-100">
                                <button
                                  type="button"
                                  onClick={() => setSelectedKanbanTechs(techniciansList.map(t => t.name))}
                                  className="text-blue-600 hover:underline font-bold"
                                >
                                  เลือกทั้งหมด ({techniciansList.length})
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSelectedKanbanTechs([])}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  ล้างค่า (แสดงทุกคน)
                                </button>
                              </div>

                              {/* Checkbox List */}
                              <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                                {techniciansList
                                  .filter(t => t.name.toLowerCase().includes(kanbanTechSearch.toLowerCase()) || t.role.toLowerCase().includes(kanbanTechSearch.toLowerCase()))
                                  .map(tech => {
                                    const isChecked = selectedKanbanTechs.includes(tech.name);
                                    const count = pmTasks.filter(t => t.assignees?.includes(tech.name)).length;
                                    return (
                                      <div
                                        key={tech.name}
                                        onClick={() => {
                                          if (isChecked) {
                                            setSelectedKanbanTechs(selectedKanbanTechs.filter(n => n !== tech.name));
                                          } else {
                                            setSelectedKanbanTechs([...selectedKanbanTechs, tech.name]);
                                          }
                                        }}
                                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${isChecked ? 'bg-blue-50/80 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'}`}
                                      >
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="checkbox"
                                            checked={isChecked}
                                            readOnly
                                            className="rounded text-blue-600 pointer-events-none w-3.5 h-3.5"
                                          />
                                          <div className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${tech.color} text-white font-bold text-[10px] flex items-center justify-center`}>
                                            {tech.avatar}
                                          </div>
                                          <div>
                                            <div className="text-xs font-bold text-gray-900">{tech.name}</div>
                                            <div className="text-[10px] text-gray-500">{tech.role}</div>
                                          </div>
                                        </div>
                                        <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full font-medium">
                                          {count} งาน
                                        </span>
                                      </div>
                                    );
                                  })}
                              </div>

                              <div className="pt-2 border-t border-gray-100 flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => setIsKanbanTechDropdownOpen(false)}
                                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700"
                                >
                                  ตกลง
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Quick Chips of Selected Technicians */}
                      {selectedKanbanTechs.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          {selectedKanbanTechs.map(name => (
                            <span 
                              key={name}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200"
                            >
                              {name.split(' ')[1]}
                              <button 
                                onClick={() => setSelectedKanbanTechs(selectedKanbanTechs.filter(n => n !== name))}
                                className="hover:text-blue-950 font-bold ml-0.5"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                          <button
                            onClick={() => setSelectedKanbanTechs([])}
                            className="text-xs text-gray-500 hover:text-gray-700 underline ml-1"
                          >
                            ล้างทั้งหมด
                          </button>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => {
                        setStatsTimeMode('daily');
                        setStatsDate('2026-07-11');
                        setSelectedStatsTechs(selectedKanbanTechs);
                        setCurrentView('pm-monthly-summary');
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1.5 shrink-0 hover:underline px-2"
                    >
                      <PieChart className="w-3.5 h-3.5" />
                      ดูสถิติภาระงานช่างรายวันแบบละเอียด &rarr;
                    </button>
                  </div>

                  {['2026-07-10', '2026-07-11', '2026-07-12'].map((dateKey) => {
                    const isOpen = !!openDateSections[dateKey];
                    const rawDateTasks = pmTasks.filter(t => t.date === dateKey);
                    // กรองตามช่างที่เลือก (Multi-Select)
                    const dateTasks = selectedKanbanTechs.length === 0 
                      ? rawDateTasks 
                      : rawDateTasks.filter(t => t.assignees?.some(a => selectedKanbanTechs.includes(a)));
                const isToday = dateKey === '2026-07-11';
                const isPast = dateKey === '2026-07-10';
                const isFuture = dateKey === '2026-07-12';
                const dateLabel = isPast
                  ? 'เมื่อวาน (10 กรกฎาคม 2569) - ประวัติงานที่ผ่านมา'
                  : isToday
                    ? 'วันนี้ (11 กรกฎาคม 2569) - งานประจำวัน'
                    : 'พรุ่งนี้ (12 กรกฎาคม 2569) - แผนงานล่วงหน้า';

                // 5 สถานะหลัก
                const pendingTasks = dateTasks.filter(t => t.status === 'รอดำเนินการ');
                const inProgressTasks = dateTasks.filter(t => t.status === 'กำลังดำเนินการ');
                const reviewTasks = dateTasks.filter(t => t.status === 'รออนุมัติ');
                const reworkTasks = dateTasks.filter(t => t.status === 'ส่งกลับแก้ไข');
                const approvedTasks = dateTasks.filter(t => t.status === 'อนุมัติแล้ว');

                return (
                  <div key={dateKey} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header ของ Section วันที่ (กด Toggle เปิด-ปิดได้) */}
                    <div 
                      onClick={() => toggleDateSection(dateKey)}
                      className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${isOpen ? 'bg-gray-50 border-b border-gray-200' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isToday ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900 text-base">{dateLabel}</h3>
                            {isToday && <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">วันปัจจุบัน</span>}
                            {isFuture && <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">แผนล่วงหน้า</span>}
                            {isPast && <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">ประวัติย้อนหลัง</span>}
                          </div>
                          <p className="text-xs text-gray-500">มีงานทั้งหมด {dateTasks.length} รายการ (เสร็จแล้ว {approvedTasks.length} รายการ)</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex gap-2 text-xs">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">รอทำ: {pendingTasks.length}</span>
                          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-medium">รออนุมัติ: {reviewTasks.length}</span>
                          {reworkTasks.length > 0 && <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold">ส่งกลับ: {reworkTasks.length}</span>}
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">อนุมัติ: {approvedTasks.length}</span>
                        </div>
                        <div className={`p-1.5 rounded-lg bg-white border border-gray-200 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* ตัวกระดาน Kanban 5 คอลัมน์ (จะแสดงเมื่อ Section ถูกเปิด) */}
                    {isOpen && (
                      <div className="p-5 bg-gray-50/60 overflow-x-auto space-y-4">
                        
                        {/* แถบแจ้งเตือนเมื่อกำลังกรองตามช่าง (Multi-Select) */}
                        {selectedKanbanTechs.length > 0 && (
                          <div className="flex items-center justify-between bg-blue-50/80 border border-blue-200 px-3.5 py-2 rounded-xl text-xs">
                            <span className="text-blue-900 font-medium">
                              กำลังกรองแสดงงานของช่าง ({selectedKanbanTechs.length} คน): <strong className="font-bold">{selectedKanbanTechs.map(s => s.split(' ')[1]).join(', ')}</strong> ({dateTasks.length} งาน)
                            </span>
                            <button 
                              onClick={() => setSelectedKanbanTechs([])} 
                              className="text-blue-700 font-bold hover:underline"
                            >
                              &times; ล้างตัวกรองช่าง (แสดงทุกคน)
                            </button>
                          </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 min-w-[1100px]">
                          
                          {/* 1. คอลัมน์: รอดำเนินการ */}
                          <div className="bg-gray-100/70 p-3 rounded-2xl flex flex-col">
                            <div className="flex justify-between items-center mb-3 px-1">
                              <span className="font-bold text-xs text-gray-700 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-gray-500" /> รอดำเนินการ
                              </span>
                              <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-gray-600 shadow-2xs">{pendingTasks.length}</span>
                            </div>
                            <div className="space-y-3 flex-1">
                              {pendingTasks.map(task => renderKanbanCard(task))}
                              {pendingTasks.length === 0 && <div className="text-center py-8 text-xs text-gray-400">ไม่มีงานในสถานะนี้</div>}
                            </div>
                          </div>

                          {/* 2. คอลัมน์: กำลังดำเนินการ */}
                          <div className="bg-blue-50/50 p-3 rounded-2xl flex flex-col">
                            <div className="flex justify-between items-center mb-3 px-1">
                              <span className="font-bold text-xs text-blue-800 flex items-center gap-1.5">
                                <Activity className="w-3.5 h-3.5 text-blue-600" /> กำลังดำเนินการ
                              </span>
                              <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-blue-700 shadow-2xs">{inProgressTasks.length}</span>
                            </div>
                            <div className="space-y-3 flex-1">
                              {inProgressTasks.map(task => renderKanbanCard(task))}
                              {inProgressTasks.length === 0 && <div className="text-center py-8 text-xs text-gray-400">ไม่มีงานในสถานะนี้</div>}
                            </div>
                          </div>

                          {/* 3. คอลัมน์: รออนุมัติ (หัวหน้าต้องตรวจ) */}
                          <div className="bg-amber-50/60 p-3 rounded-2xl flex flex-col border-2 border-amber-300/60 shadow-xs">
                            <div className="flex justify-between items-center mb-3 px-1">
                              <span className="font-bold text-xs text-amber-800 flex items-center gap-1.5">
                                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> รออนุมัติ (หัวหน้า)
                              </span>
                              <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full text-xs font-bold shadow-2xs">{reviewTasks.length}</span>
                            </div>
                            <div className="space-y-3 flex-1">
                              {reviewTasks.map(task => renderKanbanCard(task, true))}
                              {reviewTasks.length === 0 && <div className="text-center py-8 text-xs text-gray-400">ไม่มีงานรอตรวจ</div>}
                            </div>
                          </div>

                          {/* 4. คอลัมน์: ส่งกลับแก้ไข (Rejected / Rework) */}
                          <div className="bg-rose-50/60 p-3 rounded-2xl flex flex-col border border-rose-200">
                            <div className="flex justify-between items-center mb-3 px-1">
                              <span className="font-bold text-xs text-rose-800 flex items-center gap-1.5">
                                <Undo2 className="w-3.5 h-3.5 text-rose-600" /> ส่งกลับแก้ไข
                              </span>
                              <span className="bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full text-xs font-bold shadow-2xs">{reworkTasks.length}</span>
                            </div>
                            <div className="space-y-3 flex-1">
                              {reworkTasks.map(task => renderKanbanCard(task))}
                              {reworkTasks.length === 0 && <div className="text-center py-8 text-xs text-gray-400">ไม่มีงานตีกลับ</div>}
                            </div>
                          </div>

                          {/* 5. คอลัมน์: อนุมัติแล้ว (Closed / Done) */}
                          <div className="bg-emerald-50/40 p-3 rounded-2xl flex flex-col">
                            <div className="flex justify-between items-center mb-3 px-1">
                              <span className="font-bold text-xs text-emerald-800 flex items-center gap-1.5">
                                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> อนุมัติแล้ว (ปิดงาน)
                              </span>
                              <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-emerald-700 shadow-2xs">{approvedTasks.length}</span>
                            </div>
                            <div className="space-y-3 flex-1">
                              {approvedTasks.map(task => renderKanbanCard(task))}
                              {approvedTasks.length === 0 && <div className="text-center py-8 text-xs text-gray-400">ยังไม่มีงานเสร็จ</div>}
                            </div>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 2: PM DETAIL (หน้าตรวจงาน ช่างติ๊ก Checklist & หัวหน้าอนุมัติ) */}
          {/* ======================================================== */}
          {currentView === 'pm-detail' && selectedPMTask && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <button 
                onClick={() => setCurrentView('pm-list')}
                className="flex items-center gap-2 text-gray-600 hover:text-black font-semibold text-sm transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> กลับหน้ารายการ PM (Kanban)
              </button>

              {/* Status Banner */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl font-bold text-xl">
                    {selectedPMTask.cycle}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-bold text-gray-900">{selectedPMTask.id}</h1>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeStyle(selectedPMTask.status)}`}>
                        {selectedPMTask.status}
                      </span>
                      {/* แท็กผลประเมินสุขภาพเครื่องจักร (แสดงเฉพาะเมื่อส่งตรวจหรือตรวจเสร็จแล้ว) */}
                      {selectedPMTask.status !== 'รอดำเนินการ' && selectedPMTask.status !== 'กำลังดำเนินการ' && selectedPMTask.technicianHealthAssessment && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getHealthBadgeStyle(selectedPMTask.technicianHealthAssessment)}`}>
                          สุขภาพเครื่อง: {selectedPMTask.technicianHealthAssessment}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1 font-medium">{selectedPMTask.title}</p>
                  </div>
                </div>

                {/* ป้ายแสดงมุมมองและบทบาท (ปุ่ม Action ย้ายไปอยู่ใต้ Checklist ตามข้อ 10.4) */}
                <div className="flex items-center gap-2 self-start md:self-center">
                  <span className="text-xs text-gray-400 font-medium">มุมมอง:</span>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${userRole === 'manager' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                    {userRole === 'manager' ? '👔 ผู้จัดการ (Manager)' : '🔧 ช่างเทคนิค (Technician)'}
                  </span>
                </div>
              </div>

              {/* ข้อความตีกลับจากหัวหน้า (ถ้ามี) */}
              {selectedPMTask.status === 'ส่งกลับแก้ไข' && selectedPMTask.managerReviewNote && (
                <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 shadow-sm flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-rose-900 text-sm">หัวหน้าแผนกส่งกลับให้แก้ไข:</h4>
                    <p className="text-xs text-rose-700 mt-1 leading-relaxed">{selectedPMTask.managerReviewNote}</p>
                    <span className="text-xs text-rose-500 mt-2 block font-medium">* ช่างตรวจสอบข้อบกพร่อง ปรับปรุงข้อมูล Checklist หรือถ่ายรูปแนบใหม่ แล้วกด "ส่งผลตรวจให้หัวหน้าอนุมัติ"</span>
                  </div>
                </div>
              )}

              {/* ข้อมูลอุปกรณ์และประเภทงาน Service ในใบนี้ */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                  <span className="text-xs font-semibold text-gray-400 block mb-1">อุปกรณ์เป้าหมาย</span>
                  <div className="flex items-center gap-2 text-base font-bold text-gray-900">
                    <Settings className="w-5 h-5 text-blue-600" />
                    <span>{selectedPMTask.equipment}</span>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">รอบการตรวจ: {selectedPMTask.cycle}</span>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-semibold text-gray-400">ผู้รับผิดชอบ (มอบหมายโดยผู้จัดการ)</span>
                      {userRole === 'manager' && (
                        <button 
                          onClick={() => {
                            setTaskToReassign(selectedPMTask);
                            setNewAssigneeName(selectedPMTask.assignees[0] || "EMP สมชาย (ช่างแอร์)");
                            setShowReassignModal(true);
                          }}
                          className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" /> เปลี่ยนช่าง
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>{selectedPMTask.assignees.join(', ')}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 mt-2 block">กำหนดวัน: {selectedPMTask.date}</span>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                  <span className="text-xs font-semibold text-gray-400 block mb-1">ประเภทงาน Service ที่ต้องทำในครั้งนี้</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {selectedPMTask.serviceTypeIds.map(stId => {
                      const st = getServiceTypeInfo(stId);
                      const StIcon = st.icon;
                      return (
                        <span key={stId} className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold border ${st.color}`}>
                          <StIcon className="w-3.5 h-3.5" />
                          <span>{st.shortName}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* CHECKLIST ของอุปกรณ์ตัวนี้ในรอบนี้ (กดได้เฉพาะสถานะ 'กำลังดำเนินการ' ตามข้อ 10.3) */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2 mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                      <ClipboardCheck className="w-5 h-5 text-blue-600" />
                      รายการตรวจสอบมาตรฐาน (Standard Checklist สำหรับ {selectedPMTask.equipment} รอบ {selectedPMTask.cycle})
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {selectedPMTask.status === 'กำลังดำเนินการ'
                        ? 'ทำเครื่องหมายว่าได้ทำการซ่อมบำรุงตามรายการครบถ้วน (คลิกเพื่อทำเครื่องหมาย)'
                        : 'รายการ Checklist ถูกล็อก (คลิกได้เฉพาะเมื่อสถานะเป็น "กำลังดำเนินการ")'}
                    </p>
                  </div>
                  <div className="text-xs font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                    ตรวจแล้ว {(selectedPMTask.completedChecklistIds || []).length} / {getTaskChecklist(selectedPMTask).length} รายการ
                  </div>
                </div>

                {/* แถบแจ้งเตือนเมื่อสถานะไม่ใช่ "กำลังดำเนินการ" ตามข้อ 10.3 */}
                {selectedPMTask.status !== 'กำลังดำเนินการ' && (
                  <div className="mb-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 text-xs text-amber-900 font-medium">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                      <span>
                        <strong>Checklist ถูกล็อก:</strong> สามารถบันทึกผลได้เฉพาะเมื่ออยู่ในสถานะ <strong>"กำลังดำเนินการ"</strong> เท่านั้น (สถานะปัจจุบัน: <span className="font-bold underline">{selectedPMTask.status}</span>)
                      </span>
                    </div>
                    {selectedPMTask.status === 'รอดำเนินการ' && (
                      <button
                        onClick={() => openStatusUpdateModal(selectedPMTask)}
                        className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-2xs transition-colors"
                      >
                        กดเริ่มงานเพื่อปลดล็อก Checklist
                      </button>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  {getTaskChecklist(selectedPMTask).map((item, idx) => {
                    const isChecked = (selectedPMTask.completedChecklistIds || []).includes(item.id);
                    const st = getServiceTypeInfo(item.serviceTypeId);
                    const StIcon = st.icon;
                    const isEditable = selectedPMTask.status === 'กำลังดำเนินการ';

                    return (
                      <div 
                        key={item.id}
                        onClick={() => {
                          if (isEditable) {
                            handleToggleChecklistItem(item.id);
                          }
                        }}
                        className={`p-4 rounded-2xl border transition-all flex items-start gap-4 select-none ${
                          !isEditable
                            ? 'opacity-60 cursor-not-allowed bg-gray-100/70 border-gray-200'
                            : 'cursor-pointer hover:border-blue-300 ' + (isChecked ? 'bg-emerald-50/40 border-emerald-300 shadow-2xs' : 'bg-gray-50 border-gray-200')
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-gray-300'}`}>
                          {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-gray-500">ข้อที่ {idx + 1}</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.2 rounded text-xs font-bold border ${st.color}`}>
                              <StIcon className="w-3 h-3" /> {st.shortName}
                            </span>
                          </div>
                          <p className={`text-sm ${isChecked ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                            {item.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ACTION & STATUS WORKFLOW SECTION (อยู่ใต้ Checklist ตามข้อ 10.4 เพื่อให้ไล่ตรวจตาม Checklist ก่อนปรับสถานะ) */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-blue-600" />
                      การจัดการสถานะ & ส่งมอบงาน (Workflow Action)
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {selectedPMTask.status === 'รอดำเนินการ' && 'งานยังไม่เริ่ม ให้กดปรับสถานะเป็น "กำลังดำเนินการ" เพื่อปลดล็อก Checklist'}
                      {selectedPMTask.status === 'กำลังดำเนินการ' && 'ตรวจเช็ค Checklist ครบถ้วนแล้ว ให้กดปรับสถานะ & แนบรูปถ่ายเพื่อส่งขออนุมัติ'}
                      {selectedPMTask.status === 'รออนุมัติ' && (userRole === 'manager' ? 'งานรอการตรวจสอบ ผู้จัดการสามารถกดอนุมัติปิดงาน หรือส่งกลับแก้ไขได้' : 'งานอยู่ระหว่างรอผู้จัดการแผนกอนุมัติปิดงาน')}
                      {selectedPMTask.status === 'ส่งกลับแก้ไข' && 'งานถูกส่งกลับแก้ไข กรุณาปรับปรุงข้อมูลหรือถ่ายรูปแนบใหม่ แล้วกดส่งขออนุมัติ'}
                      {selectedPMTask.status === 'อนุมัติแล้ว' && 'งานผ่านการอนุมัติปิดงานเรียบร้อยแล้ว'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    {/* ปุ่มปรับสถานะ & แนบรูปภาพ (ทั้งช่างและผจก. กดได้ตามข้อ 10.1 ถ้ายังไม่อนุมัติ) */}
                    {selectedPMTask.status !== 'อนุมัติแล้ว' && (
                      <button 
                        onClick={() => openStatusUpdateModal(selectedPMTask)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl transition-colors shadow-sm text-sm font-bold"
                      >
                        <Edit className="w-4 h-4" />
                        <span>ปรับสถานะ & แนบรูปภาพ / ส่งงาน</span>
                      </button>
                    )}

                    {/* ปุ่มอนุมัติสำหรับผู้จัดการเท่านั้น (แสดงเมื่อสถานะเป็น "รออนุมัติ") */}
                    {userRole === 'manager' && selectedPMTask.status === 'รออนุมัติ' && (
                      <button 
                        onClick={() => setShowManagerApprovalModal(true)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-2xl transition-colors shadow-sm text-sm font-bold ring-2 ring-emerald-500/20"
                      >
                        <ShieldAlert className="w-4 h-4 text-white" />
                        <span>ตรวจสอบ & อนุมัติปิดงาน (ผจก.)</span>
                      </button>
                    )}

                    {/* สัญลักษณ์แจ้งเตือนช่างเมื่องานรออนุมัติ */}
                    {userRole === 'technician' && selectedPMTask.status === 'รออนุมัติ' && (
                      <span className="text-xs bg-amber-50 text-amber-800 font-bold px-3.5 py-2.5 rounded-2xl border border-amber-200 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-600" /> ส่งผลตรวจแล้ว รอผู้จัดการอนุมัติ
                      </span>
                    )}

                    {/* สถานะอนุมัติแล้ว */}
                    {selectedPMTask.status === 'อนุมัติแล้ว' && (
                      <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-4 py-2.5 rounded-2xl border border-emerald-200 flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> อนุมัติปิดงานเรียบร้อยแล้ว
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* รูปถ่ายการปฏิบัติงานหน้างานจริง (Gallery สำหรับตรวจสอบ - การเพิ่มรูปย้ายไปอยู่ที่ Modal ปรับสถานะตามข้อ 10.5) */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-blue-600" />
                    รูปถ่ายการปฏิบัติงานหน้างานจริง ({(selectedPMTask.workPhotos || []).length} รูป)
                  </h3>
                  <span className="text-xs text-gray-400 font-medium">
                    (แนบและจัดการรูปถ่ายได้ที่หน้าต่าง "ปรับสถานะ")
                  </span>
                </div>

                {selectedPMTask.workPhotos && selectedPMTask.workPhotos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    {selectedPMTask.workPhotos.map((photoUrl, pIdx) => (
                      <div key={pIdx} className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-xs h-48 bg-gray-100 group">
                        <img src={photoUrl} alt="Work Evidence" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs p-2 text-center backdrop-blur-xs font-medium">
                          รูปถ่ายหน้างานจริง #{pIdx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 text-center text-xs text-gray-500 mb-4">
                    <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="font-semibold text-gray-700">ยังไม่มีรูปถ่ายหน้างานแนบในใบงานนี้</p>
                    <p className="text-gray-400 mt-1">สามารถกดปุ่ม <strong>"ปรับสถานะ & แนบรูปภาพ / ส่งงาน"</strong> ด้านบนเพื่อแนบรูปถ่ายการทำงาน</p>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-gray-700">บันทึกสรุปผลโดยช่าง:</span>
                    {selectedPMTask.status !== 'รอดำเนินการ' && selectedPMTask.status !== 'กำลังดำเนินการ' && selectedPMTask.technicianHealthAssessment ? (
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getHealthBadgeStyle(selectedPMTask.technicianHealthAssessment)}`}>
                        ประเมินสุขภาพ: {selectedPMTask.technicianHealthAssessment}
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-400 italic font-medium">
                        (รอประเมินเมื่อส่งงาน)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mt-1">
                    {selectedPMTask.technicianNote || 'ยังไม่ได้ระบุบันทึกผล'}
                  </p>
                </div>
              </div>

              {/* ไทม์ไลน์การทำงาน */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                  <History className="w-5 h-5 text-gray-500" /> ไทม์ไลน์การดำเนินงาน
                </h3>
                <div className="space-y-4 border-l-2 border-gray-200 ml-3 pl-4">
                  {selectedPMTask.timeline.map((event, eIdx) => (
                    <div key={eIdx} className="relative">
                      <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-blue-600 border-2 border-white ring-2 ring-blue-100"></div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">{event.user}</span>
                        <span className="text-xs text-gray-400">({event.date} {event.time})</span>
                        <span className={`text-xs px-2 py-0.2 rounded font-bold border ${getStatusBadgeStyle(event.status)}`}>{event.status}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{event.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 3: PM STATISTICS (สถิติและรายงานสรุปการบำรุงรักษา) */}
          {/* ======================================================== */}
          {currentView === 'pm-monthly-summary' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              {/* Header Title */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">สถิติและผลการดำเนินงานบำรุงรักษาเชิงป้องกัน (PM Analytics)</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  วิเคราะห์ผลการปฏิบัติงานตามช่วงเวลา และผลการตรวจประเมินสุขภาพอุปกรณ์ของทีมช่าง
                </p>
              </div>

              {/* ======================================================== */}
              {/* GLOBAL FILTER BAR (วางเหนือ 4 KPI Cards ตามสั่ง) */}
              {/* ======================================================== */}
              <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* ฝั่งซ้าย: สลับมุมมอง รายเดือน vs รายวัน พร้อม Picker */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Toggle Mode Buttons */}
                    <div className="bg-gray-100 p-1 rounded-2xl flex items-center text-xs font-bold border border-gray-200">
                      <button
                        onClick={() => setStatsTimeMode('monthly')}
                        className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${statsTimeMode === 'monthly' ? 'bg-blue-600 text-white shadow-2xs font-extrabold' : 'text-gray-600 hover:text-gray-900'}`}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        มุมมองรายเดือน
                      </button>
                      <button
                        onClick={() => setStatsTimeMode('daily')}
                        className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${statsTimeMode === 'daily' ? 'bg-black text-white shadow-2xs font-extrabold' : 'text-gray-600 hover:text-gray-900'}`}
                      >
                        <CalendarDays className="w-3.5 h-3.5" />
                        มุมมองรายวัน
                      </button>
                    </div>

                    {/* แสดง Picker ตาม Mode */}
                    {statsTimeMode === 'monthly' ? (
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Month Picker Input */}
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 px-3 py-1.5 rounded-xl text-xs">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          <span className="font-bold text-gray-600">เลือกเดือน:</span>
                          <input 
                            type="month"
                            value={statsMonth}
                            onChange={(e) => setStatsMonth(e.target.value)}
                            className="bg-transparent font-bold text-gray-800 outline-none cursor-pointer"
                          />
                        </div>

                        {/* Quick Month Shortcuts */}
                        <div className="flex items-center gap-1.5 text-xs">
                          <button
                            onClick={() => setStatsMonth('2026-07')}
                            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${statsMonth === '2026-07' ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                          >
                            ก.ค. 69 (เดือนนี้)
                          </button>
                          <button
                            onClick={() => setStatsMonth('2026-06')}
                            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${statsMonth === '2026-06' ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                          >
                            มิ.ย. 69
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Date Picker Input */}
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 px-3 py-1.5 rounded-xl text-xs">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <span className="font-bold text-gray-600">เลือกวันที่:</span>
                          <input 
                            type="date"
                            value={statsDate}
                            onChange={(e) => setStatsDate(e.target.value)}
                            className="bg-transparent font-bold text-gray-800 outline-none cursor-pointer"
                          />
                        </div>

                        {/* Quick Date Pills */}
                        <div className="flex items-center gap-1.5 text-xs">
                          <button
                            onClick={() => setStatsDate('2026-07-10')}
                            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${statsDate === '2026-07-10' ? 'bg-gray-950 border-gray-950 text-white font-bold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                          >
                            10 ก.ค. (เมื่อวาน)
                          </button>
                          <button
                            onClick={() => setStatsDate('2026-07-11')}
                            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${statsDate === '2026-07-11' ? 'bg-blue-600 border-blue-600 text-white font-bold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                          >
                            11 ก.ค. (วันนี้)
                          </button>
                          <button
                            onClick={() => setStatsDate('2026-07-12')}
                            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${statsDate === '2026-07-12' ? 'bg-purple-600 border-purple-600 text-white font-bold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                          >
                            12 ก.ค. (พรุ่งนี้)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ฝั่งขวา: SEARCHABLE MULTI-SELECT DROPDOWN สำหรับเลือกช่าง */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsStatsTechDropdownOpen(prev => !prev)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shadow-2xs ${selectedStatsTechs.length > 0 ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                    >
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>
                        {selectedStatsTechs.length === 0 
                          ? `ช่างทุกคน (${techniciansList.length} คน)` 
                          : selectedStatsTechs.length === 1 
                            ? selectedStatsTechs[0].split(' ')[1] 
                            : `เลือกช่าง ${selectedStatsTechs.length} คน`}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isStatsTechDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Popover */}
                    {isStatsTechDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setIsStatsTechDropdownOpen(false)} 
                        />
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 p-3 space-y-2.5 animate-in fade-in duration-150">
                          {/* Search Input */}
                          <div className="relative">
                            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                            <input
                              type="text"
                              value={statsTechSearch}
                              onChange={(e) => setStatsTechSearch(e.target.value)}
                              placeholder="ค้นหาชื่อ หรือตำแหน่งช่าง..."
                              className="w-full pl-8 pr-7 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                              autoFocus
                            />
                            {statsTechSearch && (
                              <button 
                                onClick={() => setStatsTechSearch('')} 
                                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 text-xs"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Quick Actions */}
                          <div className="flex items-center justify-between text-[11px] px-1 pb-1 border-b border-gray-100">
                            <button
                              type="button"
                              onClick={() => setSelectedStatsTechs(techniciansList.map(t => t.name))}
                              className="text-blue-600 hover:underline font-bold"
                            >
                              เลือกทั้งหมด ({techniciansList.length})
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedStatsTechs([])}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              ล้างค่า (แสดงทุกคน)
                            </button>
                          </div>

                          {/* Checkbox List */}
                          <div className="max-h-52 overflow-y-auto space-y-1 pr-1">
                            {techniciansList
                              .filter(t => t.name.toLowerCase().includes(statsTechSearch.toLowerCase()) || t.role.toLowerCase().includes(statsTechSearch.toLowerCase()))
                              .map(tech => {
                                const isChecked = selectedStatsTechs.includes(tech.name);
                                const count = pmTasks.filter(t => t.assignees?.includes(tech.name)).length;
                                return (
                                  <div
                                    key={tech.name}
                                    onClick={() => {
                                      if (isChecked) {
                                        setSelectedStatsTechs(selectedStatsTechs.filter(n => n !== tech.name));
                                      } else {
                                        setSelectedStatsTechs([...selectedStatsTechs, tech.name]);
                                      }
                                    }}
                                    className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${isChecked ? 'bg-blue-50/80 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'}`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        readOnly
                                        className="rounded text-blue-600 pointer-events-none w-3.5 h-3.5"
                                      />
                                      <div className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${tech.color} text-white font-bold text-[10px] flex items-center justify-center`}>
                                        {tech.avatar}
                                      </div>
                                      <div>
                                        <div className="text-xs font-bold text-gray-900">{tech.name}</div>
                                        <div className="text-[10px] text-gray-500">{tech.role}</div>
                                      </div>
                                    </div>
                                    <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full font-medium">
                                      {count} งาน
                                    </span>
                                  </div>
                                );
                              })}
                          </div>

                          <div className="pt-2 border-t border-gray-100 flex justify-end">
                            <button
                              type="button"
                              onClick={() => setIsStatsTechDropdownOpen(false)}
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700"
                            >
                              ตกลง
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* แถบสรุปตัวกรองที่กำลังใช้งาน (Active Filters Status Bar) */}
                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-2 text-gray-600">
                    <span className="font-semibold text-gray-500">ผลสถิติที่แสดง:</span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-bold border border-blue-200">
                      {statsTimeMode === 'monthly' ? `ประจำเดือน ${statsMonth}` : `ประจำวันที่ ${statsDate}`}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-700 font-bold border border-purple-200">
                      ช่าง: {selectedStatsTechs.length === 0 ? `ทุกคน (${techniciansList.length} คน)` : `${selectedStatsTechs.length} คน (${selectedStatsTechs.map(t => t.split(' ')[1]).join(', ')})`}
                    </span>
                    <span className="text-gray-400">&bull;</span>
                    <span className="text-gray-700 font-medium">พบทั้งหมด <strong className="font-bold text-gray-900">{filteredStatsTasks.length}</strong> ใบงาน</span>
                  </div>

                  {(selectedStatsTechs.length > 0 || statsTimeMode !== 'daily' || statsDate !== '2026-07-11') && (
                    <button
                      onClick={() => {
                        setStatsTimeMode('daily');
                        setStatsDate('2026-07-11');
                        setStatsMonth('2026-07');
                        setSelectedStatsTechs([]);
                      }}
                      className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 hover:underline"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> รีเซ็ตตัวกรองทั้งหมด
                    </button>
                  )}
                </div>
              </div>

              {/* 4 KPI Cards สรุปตัวเลข (ผูกกับ filteredStatsTasks ทั้งหมด) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                  <span className="text-xs font-semibold text-gray-500 block mb-1">งาน PM ตามแผนทั้งหมด</span>
                  <div className="text-3xl font-bold text-gray-900">{filteredStatsTasks.length} <span className="text-xs font-normal text-gray-400">ใบงาน</span></div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                  <span className="text-xs font-semibold text-emerald-600 block mb-1">อนุมัติปิดงานแล้ว</span>
                  <div className="text-3xl font-bold text-emerald-600">{filteredStatsTasks.filter(t => t.status === 'อนุมัติแล้ว').length} <span className="text-xs font-normal text-gray-400">ใบงาน</span></div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                  <span className="text-xs font-semibold text-amber-600 block mb-1">รอหัวหน้าอนุมัติ</span>
                  <div className="text-3xl font-bold text-amber-600">{filteredStatsTasks.filter(t => t.status === 'รออนุมัติ').length} <span className="text-xs font-normal text-gray-400">ใบงาน</span></div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                  <span className="text-xs font-semibold text-rose-600 block mb-1">ส่งกลับแก้ไข / เฝ้าระวัง</span>
                  <div className="text-3xl font-bold text-rose-600">{filteredStatsTasks.filter(t => t.status === 'ส่งกลับแก้ไข').length} <span className="text-xs font-normal text-gray-400">ใบงาน</span></div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* ภาระงานและประสิทธิภาพของช่าง (Technician Workload Analytics) */}
              {/* ======================================================== */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      ภาระงานและผลการปฏิบัติงานของช่าง ({statsTimeMode === 'monthly' ? `ประจำเดือน ${statsMonth}` : `ประจำวันที่ ${statsDate}`})
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      สรุปความคืบหน้าของแต่ละคน และผลประเมินสุขภาพอุปกรณ์ที่ช่างส่งตรวจ
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-gray-600 bg-gray-50 px-3 py-1 rounded-xl border border-gray-200">
                    แสดง {techniciansList.filter(tech => selectedStatsTechs.length === 0 || selectedStatsTechs.includes(tech.name)).length} คน
                  </span>
                </div>

                {/* การ์ดสถิติของช่างแต่ละคน (แสดงแถวละ 1 คน เต็มความกว้าง) */}
                <div className="grid grid-cols-1 gap-5">
                  {techniciansList
                    .filter(tech => selectedStatsTechs.length === 0 || selectedStatsTechs.includes(tech.name))
                    .map(tech => {
                      const assignedTasks = filteredStatsTasks.filter(t => t.assignees?.includes(tech.name));

                      const doneCount = assignedTasks.filter(t => t.status === 'อนุมัติแล้ว').length;
                      const reviewCount = assignedTasks.filter(t => t.status === 'รออนุมัติ').length;
                      const inProgCount = assignedTasks.filter(t => t.status === 'กำลังดำเนินการ').length;
                      const pendingCount = assignedTasks.filter(t => t.status === 'รอดำเนินการ').length;
                      const reworkCount = assignedTasks.filter(t => t.status === 'ส่งกลับแก้ไข').length;

                      const completionRate = assignedTasks.length > 0 
                        ? Math.round((doneCount / assignedTasks.length) * 100) 
                        : 0;

                      // ผลประเมินสุขภาพอุปกรณ์ที่ช่างคนนี้ส่งมา (เฉพาะงานที่ส่งตรวจหรือตรวจเสร็จแล้ว)
                      const evaluatedTasks = assignedTasks.filter(t => t.status !== 'รอดำเนินการ' && t.status !== 'กำลังดำเนินการ' && t.technicianHealthAssessment);
                      const healthyCount = evaluatedTasks.filter(t => t.technicianHealthAssessment === 'เรียบร้อย').length;
                      const watchCount = evaluatedTasks.filter(t => t.technicianHealthAssessment === 'งานติดตาม').length;
                      const repairCount = evaluatedTasks.filter(t => t.technicianHealthAssessment === 'งานซ่อมแซม').length;

                      return (
                        <div 
                          key={tech.name} 
                          className="bg-gray-50/70 border border-gray-200 rounded-3xl p-5 hover:border-blue-300 transition-all shadow-2xs"
                        >
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            {/* ฝั่งซ้าย: ข้อมูลช่าง, ความคืบหน้า, ตัวนับ 5 สถานะ, และผลประเมินสุขภาพ (5 cols) */}
                            <div className="lg:col-span-5 space-y-4">
                              {/* ส่วนหัวข้อมูลช่าง */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${tech.color} text-white font-extrabold text-base flex items-center justify-center shadow-xs`}>
                                    {tech.avatar}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{tech.name}</h4>
                                    <p className="text-xs text-gray-500">{tech.role}</p>
                                  </div>
                                </div>
                                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                                  {assignedTasks.length} งาน
                                </span>
                              </div>

                              {/* แถบ Progress ความคืบหน้า (2 สีหลัก: สีเขียว อนุมัติแล้ว vs สีน้ำเงิน คงค้าง - แก้ไขข้อ 2.4 ลด Visual Overload) */}
                              <div className="bg-white p-3.5 rounded-2xl border border-gray-200 space-y-2">
                                <div className="flex justify-between items-center text-xs font-medium">
                                  <span className="text-gray-500">ความสำเร็จของงาน:</span>
                                  <span className="font-bold text-gray-900">{doneCount}/{assignedTasks.length} ({completionRate}%)</span>
                                </div>
                                <div className="h-2.5 w-full bg-blue-100 rounded-full overflow-hidden flex">
                                  <div 
                                    style={{ width: `${assignedTasks.length ? (doneCount / assignedTasks.length) * 100 : 0}%` }} 
                                    className="bg-emerald-500 h-full transition-all duration-300" 
                                    title={`อนุมัติแล้ว: ${doneCount} งาน`} 
                                  />
                                  <div 
                                    style={{ width: `${assignedTasks.length ? ((assignedTasks.length - doneCount) / assignedTasks.length) * 100 : 0}%` }} 
                                    className="bg-blue-400 h-full transition-all duration-300" 
                                    title={`คงค้าง/กำลังทำ: ${assignedTasks.length - doneCount} งาน`} 
                                  />
                                </div>
                                <div className="flex justify-between text-[11px] text-gray-500 pt-0.5">
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                                    อนุมัติแล้ว: <strong className="text-emerald-700">{doneCount}</strong>
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
                                    คงค้าง: <strong className="text-blue-700">{assignedTasks.length - doneCount}</strong>
                                  </span>
                                </div>
                              </div>

                              {/* Badge นับสถานะงานครบทั้ง 5 สถานะเรียงแนวนอน */}
                              <div className="grid grid-cols-5 gap-1.5 text-center text-[11px]">
                                <div className="p-2 rounded-xl bg-white border border-gray-200">
                                  <div className="text-gray-400 text-[10px]">รอดำเนินการ</div>
                                  <div className="font-bold text-gray-700 text-xs mt-0.5">{pendingCount}</div>
                                </div>
                                <div className="p-2 rounded-xl bg-white border border-gray-200">
                                  <div className="text-blue-500 text-[10px]">กำลังทำ</div>
                                  <div className="font-bold text-blue-700 text-xs mt-0.5">{inProgCount}</div>
                                </div>
                                <div className="p-2 rounded-xl bg-white border border-gray-200">
                                  <div className="text-amber-500 text-[10px]">รออนุมัติ</div>
                                  <div className="font-bold text-amber-700 text-xs mt-0.5">{reviewCount}</div>
                                </div>
                                <div className="p-2 rounded-xl bg-white border border-gray-200">
                                  <div className="text-rose-500 text-[10px]">ส่งกลับ</div>
                                  <div className="font-bold text-rose-700 text-xs mt-0.5">{reworkCount}</div>
                                </div>
                                <div className="p-2 rounded-xl bg-white border border-gray-200">
                                  <div className="text-emerald-500 text-[10px]">ปิดงานแล้ว</div>
                                  <div className="font-bold text-emerald-700 text-xs mt-0.5">{doneCount}</div>
                                </div>
                              </div>

                              {/* ผลประเมินสุขภาพอุปกรณ์ที่ช่างตรวจแล้ว */}
                              <div className="bg-white p-3.5 rounded-2xl border border-gray-200 space-y-1.5">
                                <span className="text-[11px] font-bold text-gray-600 block">ผลประเมินสุขภาพเครื่องจักรที่ส่งตรวจ:</span>
                                {evaluatedTasks.length > 0 ? (
                                  <div className="flex flex-wrap items-center gap-2 text-xs">
                                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                                      เรียบร้อย {healthyCount}
                                    </span>
                                    <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 font-bold border border-amber-200">
                                      ติดตาม {watchCount}
                                    </span>
                                    <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-bold border border-rose-200">
                                      ซ่อมแซม {repairCount}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-400 italic">
                                    ยังไม่มีงานที่ส่งผลประเมินสุขภาพในตัวกรองนี้
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* ฝั่งขวา: รายการใบงานที่มอบหมาย (7 cols พร้อม divider บนจอใหญ่) */}
                            <div className="lg:col-span-7 space-y-2.5 lg:border-l lg:border-gray-200 lg:pl-6">
                              <div className="flex items-center justify-between pb-1">
                                <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                  <FileText className="w-4 h-4 text-blue-600" />
                                  ใบงานที่รับผิดชอบ ({assignedTasks.length} รายการ)
                                </span>
                                {assignedTasks.length > 0 && (
                                  <span className="text-[11px] text-gray-400 hidden sm:inline-block">คลิกที่ใบงานเพื่อดูรายละเอียด</span>
                                )}
                              </div>

                              {assignedTasks.length === 0 ? (
                                <div className="text-xs text-gray-400 py-10 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                                  ไม่มีงานที่มอบหมายตามตัวกรองนี้
                                </div>
                              ) : (
                                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                                  {assignedTasks.map(t => (
                                    <div 
                                      key={t.id} 
                                      onClick={() => { setSelectedPMTask(t); setCurrentView('pm-detail'); }}
                                      className="p-3.5 rounded-2xl bg-white border border-gray-200 hover:border-blue-400 hover:shadow-2xs transition-all cursor-pointer flex items-center justify-between gap-3"
                                    >
                                      <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2 text-xs">
                                          <span className="font-bold text-blue-600">{t.id}</span>
                                          <span className="text-gray-300">&bull;</span>
                                          <span className="font-bold text-gray-900">{t.equipment}</span>
                                          <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-semibold">{t.cycle}</span>
                                          {t.serviceTypeIds && t.serviceTypeIds.length > 0 && (
                                            <div className="hidden sm:flex flex-wrap gap-1">
                                              {t.serviceTypeIds.map(stId => (
                                                <span key={stId} className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100">
                                                  {getServiceTypeInfo(stId).shortName}
                                                </span>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                        <p className="text-xs text-gray-600 truncate mt-1">{t.title}</p>
                                      </div>
                                      <div className="flex items-center gap-2 shrink-0">
                                        {t.status !== 'รอดำเนินการ' && t.status !== 'กำลังดำเนินการ' && t.technicianHealthAssessment && (
                                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border hidden md:inline-block ${getHealthBadgeStyle(t.technicianHealthAssessment)}`}>
                                            {t.technicianHealthAssessment}
                                          </span>
                                        )}
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadgeStyle(t.status)}`}>
                                          {t.status}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* สรุปตามประเภทงาน Service (Service Types Breakdown) */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-blue-600" />
                  สรุปการซ่อมบำรุงแยกตามประเภทงาน (Service Activities Summary)
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.values(SERVICE_TYPES_CONFIG).map(st => {
                    const StIcon = st.icon;
                    // นับจำนวนใบงานตามตัวกรองที่ครอบคลุมประเภทงานนี้
                    const countTasks = filteredStatsTasks.filter(t => t.serviceTypeIds.includes(st.id)).length;
                    return (
                      <div key={st.id} className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 flex items-center gap-3">
                        <div className={`p-3 rounded-xl border ${st.color}`}>
                          <StIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900">{st.shortName}</div>
                          <div className="text-lg font-extrabold text-gray-800">{countTasks} <span className="text-xs font-normal text-gray-400">ครั้ง</span></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* สรุปผลสุขภาพเครื่องจักร (Asset Health Breakdown) */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 text-base mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  ผลประเมินสุขภาพเครื่องจักรจากการตรวจ PM ตามตัวกรองที่เลือก
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                    <span className="text-xs font-bold text-emerald-800 block mb-1">1. เรียบร้อย (Good / Normal)</span>
                    <div className="text-2xl font-bold text-emerald-700">{filteredStatsTasks.filter(t => t.status !== 'รอดำเนินการ' && t.status !== 'กำลังดำเนินการ' && t.technicianHealthAssessment === 'เรียบร้อย').length} รายการ</div>
                    <p className="text-xs text-gray-500 mt-1">เครื่องจักรทำงานปกติสมบูรณ์ ปิดงานได้</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                    <span className="text-xs font-bold text-amber-800 block mb-1">2. งานติดตาม (Watchlist)</span>
                    <div className="text-2xl font-bold text-amber-700">{filteredStatsTasks.filter(t => t.status !== 'รอดำเนินการ' && t.status !== 'กำลังดำเนินการ' && t.technicianHealthAssessment === 'งานติดตาม').length} รายการ</div>
                    <p className="text-xs text-gray-500 mt-1">พบสัญญาณเตือน มีจุดต้องเฝ้าระวังตรวจซ้ำ</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200">
                    <span className="text-xs font-bold text-rose-800 block mb-1">3. งานซ่อมแซม (Action Required)</span>
                    <div className="text-2xl font-bold text-rose-700">{filteredStatsTasks.filter(t => t.status !== 'รอดำเนินการ' && t.status !== 'กำลังดำเนินการ' && t.technicianHealthAssessment === 'งานซ่อมแซม').length} รายการ</div>
                    <p className="text-xs text-gray-500 mt-1">ชำรุดจริง ต้องเปิดใบงานซ่อมแซมแก้ไข</p>
                  </div>
                </div>
              </div>

              {/* ตารางแสดงรายละเอียดใบงานทั้งหมดตามตัวกรอง */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 overflow-hidden">
                <h3 className="font-bold text-gray-900 text-base mb-4">
                  ตารางงานตามตัวกรองที่เลือก ({statsTimeMode === 'monthly' ? `ประจำเดือน ${statsMonth}` : `ประจำวันที่ ${statsDate}`})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-400 uppercase font-semibold">
                        <th className="pb-3">รหัสงาน</th>
                        <th className="pb-3">วันที่</th>
                        <th className="pb-3">อุปกรณ์</th>
                        <th className="pb-3">ประเภทงานที่ทำ</th>
                        <th className="pb-3">ช่างผู้ตรวจ</th>
                        <th className="pb-3">สุขภาพเครื่อง</th>
                        <th className="pb-3">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredStatsTasks.map(t => (
                        <tr key={t.id} onClick={() => { setSelectedPMTask(t); setCurrentView('pm-detail'); }} className="hover:bg-gray-50 cursor-pointer">
                          <td className="py-3 font-bold text-blue-600">{t.id}</td>
                          <td className="py-3 text-gray-500">{t.date}</td>
                          <td className="py-3 font-bold text-gray-900">{t.equipment} ({t.cycle})</td>
                          <td className="py-3">
                            <div className="flex flex-wrap gap-1">
                              {t.serviceTypeIds.map(stId => (
                                <span key={stId} className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-medium">
                                  {getServiceTypeInfo(stId).shortName}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 text-gray-600">{t.assignees.join(', ')}</td>
                          <td className="py-3">
                            {t.status !== 'รอดำเนินการ' && t.status !== 'กำลังดำเนินการ' && t.technicianHealthAssessment ? (
                              <span className={`px-2 py-0.5 rounded-full font-bold text-xs border ${getHealthBadgeStyle(t.technicianHealthAssessment)}`}>
                                {t.technicianHealthAssessment}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-xs border ${getStatusBadgeStyle(t.status)}`}>
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {filteredStatsTasks.length === 0 && (
                        <tr>
                          <td colSpan="7" className="py-8 text-center text-xs text-gray-400">
                            ไม่พบใบงานตามตัวกรองที่เลือก (ลองเปลี่ยนวันที่หรือเลือกช่างเพิ่มเติม)
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 4: CREATE PM (Lean UX: เลือกอุปกรณ์ + รอบ ➜ Auto-fill ครบ) */}
          {/* ======================================================== */}
          {currentView === 'pm-create' && (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-sm border border-gray-200 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-blue-600" /> สร้างงานตรวจเชิงป้องกันใหม่ (Lean Dispatch)
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">เลือกอุปกรณ์และรอบ ระบบจะดึงประเภทงาน Service และ Checklist มาให้อัตโนมัติ</p>
                </div>
                <button onClick={() => setCurrentView('pm-list')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* 1. เลือกอุปกรณ์ */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">1. เลือกอุปกรณ์ (Equipment) <span className="text-red-500">*</span></label>
                  <select 
                    value={createPM_equipment}
                    onChange={(e) => setCreatePM_equipment(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500"
                  >
                    {equipmentsList.filter(eq => !eq.isArchived).map(eq => (
                      <option key={eq.id} value={eq.id}>{eq.id} - {eq.category} ({eq.location})</option>
                    ))}
                  </select>
                </div>

                {/* 2. เลือกรอบการตรวจ (1M / 6M / 1Y) */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">2. เลือกรอบการบำรุงรักษา (Maintenance Cycle) <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-3 gap-3">
                    {['1M', '6M', '1Y'].map(cycleKey => {
                      const isSelected = createPM_cycle === cycleKey;
                      const profile = getProfileForEquipment(createPM_equipment);
                      const cycleInfo = profile.cycles[cycleKey] || profile.cycles['1M'];
                      return (
                        <div 
                          key={cycleKey}
                          onClick={() => setCreatePM_cycle(cycleKey)}
                          className={`p-3.5 rounded-xl border cursor-pointer text-center transition-all ${isSelected ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                          <div className="font-bold text-sm text-gray-900">{cycleInfo.cycleLabel}</div>
                          <div className="text-xs text-gray-500 mt-1">{cycleInfo.checklist.length} ข้อตรวจ</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Live Preview: Auto-filled Service Types & Checklist */}
                {(() => {
                  const profile = getProfileForEquipment(createPM_equipment);
                  const cycleInfo = profile.cycles[createPM_cycle] || profile.cycles['1M'];
                  return (
                    <div className="bg-blue-50/40 p-4 rounded-2xl border border-blue-200/80 space-y-3">
                      <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-blue-600" /> ระบบดึงข้อมูลประเภทงานและ Checklist อัตโนมัติ:
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-gray-600 block mb-1">ประเภทงาน Service ที่ต้องทำในครั้งนี้:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {cycleInfo.serviceTypeIds.map(stId => {
                            const st = getServiceTypeInfo(stId);
                            const StIcon = st.icon;
                            return (
                              <span key={stId} className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold border ${st.color}`}>
                                <StIcon className="w-3 h-3" /> {st.shortName}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div className="border-t border-blue-200/60 pt-2">
                        <span className="text-xs font-semibold text-gray-600 block mb-1.5">Checklist Standard ทุกข้อ ({cycleInfo.checklist.length} ข้อ):</span>
                        <ul className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                          {cycleInfo.checklist.map((chk, i) => (
                            <li key={i} className="text-xs text-gray-700 flex items-start gap-2 bg-white/70 p-1.5 rounded-lg border border-blue-100">
                              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                              <span className="leading-relaxed">{chk.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })()}

                {/* 3. วันที่และผู้รับผิดชอบ */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">3. วันที่กำหนด (Schedule Date) <span className="text-red-500">*</span></label>
                    <input 
                      type="date" 
                      value={createPM_date}
                      onChange={(e) => setCreatePM_date(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">4. มอบหมายช่างผู้รับผิดชอบ (โดยผู้จัดการ) <span className="text-red-500">*</span></label>
                    <select 
                      value={createPM_assignee}
                      onChange={(e) => setCreatePM_assignee(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500"
                    >
                      <option>EMP สมชาย (ช่างแอร์)</option>
                      <option>EMP สมหญิง (ช่างไฟ)</option>
                      <option>EMP วินัย (ผู้ช่วย)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">ชื่อเรื่องใบงาน (ปรับแต่งได้ หรือปล่อยว่างเพื่อใช้ค่ามาตรฐาน)</label>
                  <input 
                    type="text" 
                    value={createPM_customTitle}
                    onChange={(e) => setCreatePM_customTitle(e.target.value)}
                    placeholder="ปล่อยว่างเพื่อใช้ชื่อมาตรฐานตามประเภทอุปกรณ์..."
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button 
                  onClick={() => setCurrentView('pm-list')}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50"
                >
                  ยกเลิก
                </button>
                <button 
                  onClick={handleCreateNewPMTask}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-sm"
                >
                  บันทึกและมอบหมายงานทันที
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 5: EQUIPMENT MANAGEMENT (จัดการ เพิ่ม/แก้ไข/ลบ Soft Delete และดูประวัติ) */}
          {/* ======================================================== */}
          {currentView === 'pm-equipment' && (() => {
            const activeEquipments = equipmentsList.filter(eq => !eq.isArchived);
            const archivedEquipments = equipmentsList.filter(eq => eq.isArchived);
            const filteredActiveEquipments = activeEquipments
              .filter(eq => selectedEqCategory === "all" || eq.category === selectedEqCategory)
              .filter(eq => searchEq === "" || eq.id.toLowerCase().includes(searchEq.toLowerCase()) || eq.category.toLowerCase().includes(searchEq.toLowerCase()) || eq.location.toLowerCase().includes(searchEq.toLowerCase()));

            const handleOpenEditEqModal = (eq) => {
              setEditingEq(eq);
              setEqFormId(eq.id);
              setEqFormCategory(eq.category);
              setEqFormType(eq.type || "AHU (Air Handling Unit)");
              setEqFormLocation(eq.location);
              setEqFormInterval(eq.interval);
              
              const profile = getProfileForEquipment(eq.id);
              setEqCyclesConfig({
                "1M": profile.cycles && profile.cycles["1M"] ? {
                  enabled: true,
                  serviceTypeIds: profile.cycles["1M"].serviceTypeIds || [],
                  checklistStr: (profile.cycles["1M"].checklist || []).map(c => c.text).join("\n")
                } : { enabled: false, serviceTypeIds: ["filter", "belt", "electrical"], checklistStr: "" },
                "6M": profile.cycles && profile.cycles["6M"] ? {
                  enabled: true,
                  serviceTypeIds: profile.cycles["6M"].serviceTypeIds || [],
                  checklistStr: (profile.cycles["6M"].checklist || []).map(c => c.text).join("\n")
                } : { enabled: false, serviceTypeIds: ["coil", "motor", "lubricant"], checklistStr: "" },
                "1Y": profile.cycles && profile.cycles["1Y"] ? {
                  enabled: true,
                  serviceTypeIds: profile.cycles["1Y"].serviceTypeIds || [],
                  checklistStr: (profile.cycles["1Y"].checklist || []).map(c => c.text).join("\n")
                } : { enabled: false, serviceTypeIds: ["belt", "motor", "electrical"], checklistStr: "" }
              });
              setShowAddEditEqModal(true);
            };

            const handleOpenAddEqModal = () => {
              setEditingEq(null);
              setEqFormId("");
              setEqFormCategory("ระบบปรับอากาศ (HVAC)");
              setEqFormType("AHU (Air Handling Unit)");
              setEqFormLocation("");
              setEqFormInterval("รายเดือน");
              setEqCyclesConfig({
                "1M": { enabled: true, serviceTypeIds: ["filter", "belt", "electrical"], checklistStr: "ตรวจเช็คการสั่นสะเทือนและเสียงผิดปกติ\nทำความสะอาดฟิลเตอร์\nเช็คความตึงสายพาน\nวัดกระแสไฟฟ้า" },
                "6M": { enabled: true, serviceTypeIds: ["coil", "motor", "lubricant"], checklistStr: "ล้างคอยล์เย็น\nอัดจารบีแบริ่งลูกปืน\nMegger Test มอเตอร์" },
                "1Y": { enabled: false, serviceTypeIds: ["belt", "motor", "electrical"], checklistStr: "เปลี่ยนสายพานชุดใหม่\nตรวจสมดุลใบพัดลม\nสอบเทียบเซนเซอร์" }
              });
              setShowAddEditEqModal(true);
            };

            return (
              <div className="space-y-6 max-w-6xl mx-auto">
                {!selectedEquipment ? (
                  <>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">ทะเบียนรายการเครื่องจักร & อุปกรณ์ (Equipment Master)</h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                          จัดการ เพิ่ม/แก้ไข/ยกเลิกใช้งานข้อมูลอุปกรณ์ (Soft Delete) และคลิกเพื่อดูประวัติการซ่อมบำรุงย้อนหลัง
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {/* ค้นหา */}
                        <div className="relative">
                          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                          <input 
                            type="text" 
                            value={searchEq}
                            onChange={(e) => setSearchEq(e.target.value)}
                            placeholder="ค้นหารหัส/ชื่ออุปกรณ์ หรือ หมวดหมู่..."
                            className="pl-9 pr-4 py-2 bg-white rounded-xl border border-gray-300 text-xs w-60 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>

                        {/* สลับมุมมอง การ์ด vs ตาราง (แก้ไขข้อ 3.1) */}
                        <div className="bg-gray-100 p-1 rounded-xl flex items-center border border-gray-200 text-xs shadow-2xs">
                          <button
                            type="button"
                            onClick={() => setEqViewMode('card')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${eqViewMode === 'card' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}
                          >
                            <LayoutGrid className="w-3.5 h-3.5" />
                            <span>การ์ด</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEqViewMode('table')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${eqViewMode === 'table' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}
                          >
                            <Table className="w-3.5 h-3.5" />
                            <span>ตาราง</span>
                          </button>
                        </div>

                        {/* ปุ่มเพิ่มอุปกรณ์ใหม่ (เฉพาะผู้จัดการ) */}
                        {userRole === 'manager' && (
                          <button 
                            onClick={handleOpenAddEqModal}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 shadow-sm transition-colors"
                          >
                            <Plus className="w-4 h-4" /> เพิ่มอุปกรณ์ใหม่
                          </button>
                        )}
                      </div>
                    </div>

                    {/* หมวดหมู่ตัวกรอง (Category Filter Tabs - แก้ไขสี Accent ข้อ 3.3) */}
                    <div className="flex flex-wrap gap-2">
                      {["all", "ระบบปรับอากาศ (HVAC)", "ระบบไฟฟ้า (Electrical)", "ระบบประปาและสุขาภิบาล (Plumbing)"].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedEqCategory(cat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedEqCategory === cat ? "bg-blue-600 text-white shadow-sm" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
                        >
                          {cat === "all" ? `ทุกหมวดหมู่ (${activeEquipments.length})` : cat}
                        </button>
                      ))}
                    </div>

                    {/* แสดงรายการอุปกรณ์ (Empty State - แก้ไขข้อ 3.4) */}
                    {filteredActiveEquipments.length === 0 ? (
                      <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
                          <Search className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-gray-800 text-base">ไม่พบรายการอุปกรณ์ตามเงื่อนไข</h3>
                        <p className="text-xs text-gray-500 max-w-sm mx-auto">
                          ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อุปกรณ์อื่น
                        </p>
                        <button
                          onClick={() => { setSearchEq(''); setSelectedEqCategory('all'); }}
                          className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors"
                        >
                          ล้างตัวกรองทั้งหมด
                        </button>
                      </div>
                    ) : eqViewMode === 'card' ? (
                      /* มุมมองการ์ด (Card View) */
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredActiveEquipments.map(eq => {
                          const history = pmTasks.filter(t => t.equipment === eq.id);
                          const lastTask = history.length > 0 ? history[0] : null;
                          const profile = getProfileForEquipment(eq.id);

                          return (
                            <div key={eq.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                              <div>
                                <div className="flex justify-between items-start mb-3">
                                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                    <Settings className="w-6 h-6" />
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {/* ปุ่มแก้ไขข้อมูลเครื่องจักร */}
                                    {userRole === 'manager' && (
                                      <>
                                        <button 
                                          onClick={() => handleOpenEditEqModal(eq)}
                                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
                                          title="แก้ไขข้อมูลเครื่องจักร"
                                        >
                                          <Edit className="w-3.5 h-3.5" />
                                        </button>
                                        <button 
                                          onClick={() => {
                                            setEqToDelete(eq);
                                            setShowDeleteEqModal(true);
                                          }}
                                          className="p-1.5 hover:bg-rose-50 rounded-lg text-gray-400 hover:text-rose-600 transition-colors"
                                          title="ยกเลิกการใช้งานอุปกรณ์ (Soft Delete)"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <h3 className="font-bold text-gray-900 text-xl mb-1">{eq.id}</h3>
                                <p className="text-xs text-gray-500 mb-1 font-medium">{eq.category}</p>
                                <p className="text-xs text-gray-400 mb-3">{eq.location}</p>

                                {/* สถิติการทำ PM */}
                                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 mb-3 text-xs space-y-1">
                                  <div className="flex justify-between text-gray-600">
                                    <span>ทำ PM ในระบบแล้ว:</span>
                                    <span className="font-bold text-gray-900">{history.length} ครั้ง</span>
                                  </div>
                                  <div className="flex justify-between text-gray-600">
                                    <span>สถานะล่าสุด:</span>
                                    <span className="font-bold text-blue-600">{lastTask ? `${lastTask.date} (${lastTask.status})` : "-"}</span>
                                  </div>
                                </div>

                                {/* แท็กประเภทงาน Service มาตรฐานของเครื่องนี้ */}
                                <div className="pt-2 border-t border-gray-100">
                                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">ประเภทงาน Service ที่ตั้งไว้:</span>
                                  <div className="flex flex-wrap gap-1">
                                    {profile.cycles && (profile.cycles["1M"] || profile.cycles["6M"] || profile.cycles["1Y"]) ? (
                                      (profile.cycles["1M"]?.serviceTypeIds || profile.cycles["6M"]?.serviceTypeIds || []).map(stId => (
                                        <span key={stId} className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-medium">
                                          {getServiceTypeInfo(stId).shortName}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-xs text-gray-400">ยังไม่ได้ระบุ</span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-5 pt-4 border-t border-gray-100 flex gap-2">
                                {/* ปุ่มดูประวัติการซ่อมบำรุงย้อนหลัง */}
                                <button 
                                  onClick={() => setSelectedEquipment(eq.id)}
                                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                                >
                                  <History className="w-3.5 h-3.5 text-gray-500" />
                                  <span>ดูประวัติ ({history.length})</span>
                                </button>

                                {/* ปุ่มสร้าง PM สำหรับเครื่องนี้ */}
                                <button 
                                  onClick={() => {
                                    setCreatePM_equipment(eq.id);
                                    setCurrentView('pm-create');
                                  }}
                                  className="py-2 px-3 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold transition-colors"
                                  title="สร้างใบงาน PM สำหรับเครื่องนี้"
                                >
                                  + สร้าง PM
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      /* มุมมองตาราง (Table View - แก้ไขข้อ 3.1) */
                      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b border-gray-200 text-gray-400 uppercase font-semibold">
                                <th className="pb-3">รหัสอุปกรณ์</th>
                                <th className="pb-3">หมวดหมู่ & ประเภท</th>
                                <th className="pb-3">ตำแหน่งติดตั้ง</th>
                                <th className="pb-3">รอบ PM ที่เปิดใช้</th>
                                <th className="pb-3">ประวัติ PM</th>
                                <th className="pb-3">สถานะล่าสุด</th>
                                <th className="pb-3 text-right">การจัดการ</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {filteredActiveEquipments.map(eq => {
                                const history = pmTasks.filter(t => t.equipment === eq.id);
                                const lastTask = history.length > 0 ? history[0] : null;
                                const profile = getProfileForEquipment(eq.id);
                                const activeCyclesKeys = profile.cycles ? Object.keys(profile.cycles) : [];

                                return (
                                  <tr key={eq.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3.5 font-bold text-blue-600 text-sm">{eq.id}</td>
                                    <td className="py-3.5">
                                      <div className="font-semibold text-gray-900">{eq.category}</div>
                                      <div className="text-[11px] text-gray-400">{eq.type}</div>
                                    </td>
                                    <td className="py-3.5 text-gray-700">{eq.location}</td>
                                    <td className="py-3.5">
                                      <div className="flex gap-1">
                                        {activeCyclesKeys.map(c => (
                                          <span key={c} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200 text-[10px]">
                                            {c}
                                          </span>
                                        ))}
                                      </div>
                                    </td>
                                    <td className="py-3.5">
                                      <span className="font-bold text-gray-900">{history.length}</span> <span className="text-gray-400">ครั้ง</span>
                                    </td>
                                    <td className="py-3.5">
                                      {lastTask ? (
                                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${getStatusBadgeStyle(lastTask.status)}`}>
                                          {lastTask.date} ({lastTask.status})
                                        </span>
                                      ) : (
                                        <span className="text-gray-400">-</span>
                                      )}
                                    </td>
                                    <td className="py-3.5 text-right">
                                      <div className="flex items-center justify-end gap-2">
                                        <button
                                          onClick={() => setSelectedEquipment(eq.id)}
                                          className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                                          title="ดูประวัติการซ่อมบำรุง"
                                        >
                                          <History className="w-3 h-3 text-gray-500" />
                                          <span>ประวัติ</span>
                                        </button>
                                        <button
                                          onClick={() => {
                                            setCreatePM_equipment(eq.id);
                                            setCurrentView('pm-create');
                                          }}
                                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 rounded-lg text-xs font-bold transition-colors"
                                          title="สร้างใบงาน PM"
                                        >
                                          + PM
                                        </button>
                                        {userRole === 'manager' && (
                                          <>
                                            <button
                                              onClick={() => handleOpenEditEqModal(eq)}
                                              className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-600 transition-colors"
                                              title="แก้ไขข้อมูลอุปกรณ์"
                                            >
                                              <Edit className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                              onClick={() => {
                                                setEqToDelete(eq);
                                                setShowDeleteEqModal(true);
                                              }}
                                              className="p-1 hover:bg-rose-50 rounded text-gray-400 hover:text-rose-600 transition-colors"
                                              title="ยกเลิกใช้งานอุปกรณ์ (Soft Delete)"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* ส่วนแสดงอุปกรณ์ที่ยกเลิกการใช้งานแล้ว (Archived Assets - Soft Deleted) */}
                    {archivedEquipments.length > 0 && (
                      <div className="mt-12 pt-8 border-t-2 border-dashed border-gray-200 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                              <Archive className="w-5 h-5 text-gray-500" />
                              อุปกรณ์ที่ยกเลิกการใช้งานแล้ว (Archived Assets - {archivedEquipments.length} เครื่อง)
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              คงประวัติการบำรุงรักษาในอดีตไว้ครบถ้วน (Soft Delete) เพื่อการตรวจสอบย้อนหลัง ไม่สามารถสร้าง PM ใหม่ได้จนกว่าจะกู้คืน
                            </p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setShowArchivedSection(prev => !prev)}
                            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 self-start sm:self-auto"
                          >
                            {showArchivedSection ? "ย่อรายการ" : "ขยายดูรายการ"} ({archivedEquipments.length})
                          </button>
                        </div>

                        {showArchivedSection && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {archivedEquipments.map(eq => {
                              const history = pmTasks.filter(t => t.equipment === eq.id);
                              return (
                                <div key={eq.id} className="bg-gray-100/70 rounded-3xl p-5 border border-dashed border-gray-300 flex flex-col justify-between opacity-85 hover:opacity-100 transition-opacity">
                                  <div>
                                    <div className="flex justify-between items-start mb-2">
                                      <span className="text-xs font-bold bg-gray-200 text-gray-700 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                        <Archive className="w-3 h-3 text-gray-500" /> ยกเลิกการใช้งานแล้ว
                                      </span>
                                      {userRole === 'manager' && (
                                        <button
                                          onClick={() => {
                                            setEquipmentsList(prev => prev.map(e => e.id === eq.id ? { ...e, isArchived: false } : e));
                                          }}
                                          className="text-xs text-emerald-700 hover:underline font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                                          title="กู้คืนอุปกรณ์ให้กลับมาใช้งาน"
                                        >
                                          <RotateCcw className="w-3 h-3" /> กู้คืนอุปกรณ์
                                        </button>
                                      )}
                                    </div>
                                    <h3 className="font-bold text-gray-700 text-lg">{eq.id}</h3>
                                    <p className="text-xs text-gray-500">{eq.category} • {eq.location}</p>
                                    <div className="mt-3 text-xs text-gray-600 bg-white p-2.5 rounded-xl border border-gray-200">
                                      ประวัติการบำรุงรักษา: <strong>{history.length}</strong> ใบงาน
                                    </div>
                                  </div>
                                  <div className="mt-4 pt-3 border-t border-gray-200">
                                    <button 
                                      onClick={() => setSelectedEquipment(eq.id)}
                                      className="w-full py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                                    >
                                      <History className="w-3.5 h-3.5 text-gray-500" />
                                      <span>ดูประวัติการซ่อมบำรุงย้อนหลัง ({history.length})</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  /* หน้ารายละเอียดประวัติการซ่อมบำรุงของอุปกรณ์ที่เลือก */
                  <div className="space-y-6">
                    <button 
                      onClick={() => setSelectedEquipment(null)}
                      className="flex items-center gap-2 text-gray-600 hover:text-black font-semibold text-sm transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> กลับหน้ารายการอุปกรณ์
                  </button>

                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                        <Settings className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h1 className="text-2xl font-bold text-gray-900">{selectedEquipment}</h1>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                            {equipmentsList.find(e => e.id === selectedEquipment)?.category || "อุปกรณ์"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          ตำแหน่งติดตั้ง: {equipmentsList.find(e => e.id === selectedEquipment)?.location || "-"} 
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => {
                          setCreatePM_equipment(selectedEquipment);
                          setCurrentView('pm-create');
                        }}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-700 shadow-sm"
                      >
                        <Plus className="w-4 h-4" /> สร้างงาน PM ให้เครื่องนี้
                      </button>
                    </div>
                  </div>

                  {/* Checklist Master Template สำหรับเครื่องนี้ */}
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-900 text-base mb-3 flex items-center gap-2">
                      <ClipboardCheck className="w-5 h-5 text-blue-600" />
                      มาตรฐาน Checklist ทุกข้อ และประเภทงาน Service ประจำเครื่อง {selectedEquipment}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(getProfileForEquipment(selectedEquipment).cycles).map(([cKey, cVal]) => (
                        <div key={cKey} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-gray-900 text-sm">{cVal.cycleLabel}</span>
                              <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{cVal.checklist.length} ข้อ</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-3">{cVal.titleTemplate}</p>
                            <div className="space-y-2 mb-3 max-h-72 overflow-y-auto pr-1">
                              {cVal.checklist.map((chk, i) => (
                                <div key={i} className="text-xs text-gray-700 flex items-start gap-2 bg-white p-2 rounded-xl border border-gray-200">
                                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                                  <span className="leading-relaxed">{chk.text}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="pt-2 border-t border-gray-200 flex flex-wrap gap-1">
                            {cVal.serviceTypeIds.map(stId => (
                              <span key={stId} className="px-1.5 py-0.5 rounded bg-white text-xs font-medium border border-gray-200">
                                {getServiceTypeInfo(stId).shortName}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ประวัติการทำ PM ย้อนหลังของเครื่องนี้ */}
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                      <History className="w-5 h-5 text-gray-500" />
                      ประวัติการบำรุงรักษาเชิงป้องกันทั้งหมด ({pmTasks.filter(t => t.equipment === selectedEquipment).length} ครั้ง)
                    </h3>

                    {pmTasks.filter(t => t.equipment === selectedEquipment).length === 0 ? (
                      <div className="text-center py-10 text-xs text-gray-400">ยังไม่มีประวัติการทำ PM ในระบบ</div>
                    ) : (
                      <div className="space-y-3">
                        {pmTasks.filter(t => t.equipment === selectedEquipment).map(t => (
                          <div 
                            key={t.id} 
                            onClick={() => { setSelectedPMTask(t); setCurrentView('pm-detail'); }}
                            className="p-4 rounded-2xl border border-gray-200 hover:border-blue-500 hover:shadow-xs transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3"
                          >
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-blue-600 text-xs">{t.id}</span>
                                <span className="text-gray-300">&bull;</span>
                                <span className="font-bold text-gray-900 text-sm">{t.title}</span>
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.2 rounded-full font-medium">{t.cycle}</span>
                              </div>
                              <p className="text-xs text-gray-500 line-clamp-1 mb-2">{t.description}</p>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                                <span>วันที่: {t.date}</span>
                                <span>ช่าง: {t.assignees.join(', ')}</span>
                                {t.status !== 'รอดำเนินการ' && t.status !== 'กำลังดำเนินการ' && t.technicianHealthAssessment && (
                                  <span className={`px-2 py-0.2 rounded-full font-bold border ${getHealthBadgeStyle(t.technicianHealthAssessment)}`}>
                                    สุขภาพเครื่อง: {t.technicianHealthAssessment}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeStyle(t.status)}`}>
                                {t.status}
                              </span>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })()}



        </div>
      </main>

      {/* ======================================================== */}
      {/* MODAL 1: หัวหน้าแผนกตรวจและอนุมัติปิดงาน หรือ ตีกลับแก้ไข */}
      {/* ======================================================== */}
      {showManagerApprovalModal && selectedPMTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-500" /> ตรวจสอบและพิจารณาอนุมัติปิดงาน
                </h3>
                <p className="text-xs text-gray-500">ใบงาน: {selectedPMTask.id} • {selectedPMTask.equipment}</p>
              </div>
              <button onClick={() => setShowManagerApprovalModal(false)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* สรุปที่ช่างประเมินมา */}
              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-gray-600">ผลประเมินสุขภาพเครื่องจักรโดยช่าง:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getHealthBadgeStyle(selectedPMTask.technicianHealthAssessment)}`}>
                    {selectedPMTask.technicianHealthAssessment}
                  </span>
                </div>
                <p className="text-xs text-gray-700 mt-2 bg-white p-2.5 rounded-xl border border-gray-200">
                  "{selectedPMTask.technicianNote || 'ช่างไม่ได้ระบุหมายเหตุเพิ่มเติม'}"
                </p>
                <div className="text-xs text-gray-500 mt-2">
                  ✓ ติ๊ก Checklist ครบ {(selectedPMTask.completedChecklistIds || []).length} / {getTaskChecklist(selectedPMTask).length} รายการ
                </div>
              </div>

              {/* การตัดสินใจของหัวหน้า */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">คำสั่งการของหัวหน้าแผนก:</label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div 
                    onClick={() => setManagerActionType('approve')}
                    className={`p-3.5 rounded-xl border cursor-pointer text-center transition-all ${managerActionType === 'approve' ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-800 font-bold' : 'border-gray-200 text-gray-600'}`}
                  >
                    <CheckCircle className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                    <span>อนุมัติปิดงาน (Approve)</span>
                  </div>

                  <div 
                    onClick={() => setManagerActionType('reject')}
                    className={`p-3.5 rounded-xl border cursor-pointer text-center transition-all ${managerActionType === 'reject' ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 text-rose-800 font-bold' : 'border-gray-200 text-gray-600'}`}
                  >
                    <Undo2 className="w-5 h-5 mx-auto mb-1 text-rose-600" />
                    <span>ส่งกลับแก้ไข (Reject)</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  {managerActionType === 'approve' ? 'บันทึกการอนุมัติ (ออปชั่น)' : 'เหตุผลที่ส่งกลับแก้ไข (จำเป็น)'}
                </label>
                <textarea 
                  rows="3"
                  value={managerInputNote}
                  onChange={(e) => setManagerInputNote(e.target.value)}
                  placeholder={managerActionType === 'approve' ? 'ระบุข้อเสนอแนะหรือบันทึกปิดงาน...' : 'เช่น รูปถ่ายกระแสไฟไม่ชัดเจน, ลืมตรวจสอบวาล์ว...'}
                  className="w-full p-3 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 resize-none"
                ></textarea>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setShowManagerApprovalModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleManagerDecision}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm ${managerActionType === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}
              >
                {managerActionType === 'approve' ? 'ยืนยันอนุมัติปิดงาน' : 'ยืนยันส่งกลับแก้ไข'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: ปรับสถานะการทำงาน & แนบรูปถ่าย (ตรงตาม Mockup ภาพจริง - ข้อ 10.1, 10.4, 10.5) */}
      {/* ======================================================== */}
      {showTechSubmitModal && selectedPMTask && (() => {
        const currentChecklist = getTaskChecklist(selectedPMTask);
        const completedCount = (selectedPMTask.completedChecklistIds || []).length;
        const totalCount = currentChecklist.length;
        const isChecklistComplete = completedCount >= totalCount;

        return (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[92vh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200 animate-in slide-in-from-bottom duration-200">
              {/* Mobile Drag Handle */}
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-2.5 sm:hidden" />

              {/* Modal Header: รหัสใบงานตรงกลางตามแบบ Mockup */}
              <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="w-8" />
                <h3 className="font-bold text-gray-900 text-lg text-center tracking-tight">
                  #{selectedPMTask.id}
                </h3>
                <button 
                  onClick={() => setShowTechSubmitModal(false)} 
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
                {/* 1. สถานะ */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">
                    สถานะ
                  </label>
                  <div className="relative">
                    <select 
                      value={techFormTargetStatus} 
                      onChange={(e) => setTechFormTargetStatus(e.target.value)}
                      className="w-full p-3.5 pr-10 border border-gray-300 rounded-2xl text-sm font-semibold text-gray-900 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                      <option value="รออนุมัติ">เสร็จสิ้น (ส่งขออนุมัติปิดงาน)</option>
                      <option value="รอดำเนินการ">รอดำเนินการ</option>
                    </select>
                    <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 2. ผู้ร่วมปฏิบัติงาน */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">
                    ผู้ร่วมปฏิบัติงาน
                  </label>
                  <div className="relative">
                    <select 
                      defaultValue=""
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val && !techFormCoWorkers.includes(val)) {
                          setTechFormCoWorkers(prev => [...prev, val]);
                        }
                        e.target.value = "";
                      }}
                      className="w-full p-3.5 pr-10 border border-gray-300 rounded-2xl text-sm text-gray-700 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" disabled>เลือกผู้ร่วมปฏิบัติงาน</option>
                      {techniciansList.map(tech => (
                        <option key={tech.name} value={tech.name}>
                          {tech.name} - {tech.role}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* แสดงรายชื่อผู้ร่วมงานที่เลือกไว้ */}
                  {techFormCoWorkers.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {techFormCoWorkers.map(name => (
                        <span key={name} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold border border-gray-200">
                          <span>{name}</span>
                          <button 
                            type="button" 
                            onClick={() => setTechFormCoWorkers(prev => prev.filter(n => n !== name))} 
                            className="hover:text-rose-600 font-bold ml-1 text-gray-400"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. ประเภทงาน */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    ประเภทงาน
                  </label>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-800 font-medium">
                      <input 
                        type="checkbox" 
                        checked={techFormWorkTypes.includes('ซ่อมบำรุง')} 
                        onChange={(e) => {
                          setTechFormWorkTypes(prev => e.target.checked ? [...prev, 'ซ่อมบำรุง'] : prev.filter(x => x !== 'ซ่อมบำรุง'));
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black" 
                      />
                      <span>ซ่อมบำรุง</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-800 font-medium">
                      <input 
                        type="checkbox" 
                        checked={techFormWorkTypes.includes('งานบริการ')} 
                        onChange={(e) => {
                          setTechFormWorkTypes(prev => e.target.checked ? [...prev, 'งานบริการ'] : prev.filter(x => x !== 'งานบริการ'));
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black" 
                      />
                      <span>งานบริการ</span>
                    </label>
                  </div>
                </div>

                {/* 4. อธิบายเพิ่มเติม (จำเป็น) */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">
                    อธิบายเพิ่มเติม (จำเป็น)
                  </label>
                  <textarea 
                    rows="3"
                    value={techFormNote}
                    onChange={(e) => setTechFormNote(e.target.value)}
                    placeholder="เช่น สิ่งที่จะดำเนินการ หรือระยะเวลา"
                    className="w-full p-3.5 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-800"
                  />
                </div>

                {/* Checklist Gate Enforcement (แจ้งเตือนหากเลือกเสร็จสิ้น/รออนุมัติ แต่ยังตรวจ Checklist ไม่ครบ) */}
                {techFormTargetStatus === "รออนุมัติ" && !isChecklistComplete && (
                  <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 text-xs text-rose-900 space-y-2 animate-in fade-in duration-150">
                    <div className="flex items-center gap-2 font-bold text-rose-800">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      ยังตรวจ Checklist ไม่ครบ ({completedCount}/{totalCount} ข้อ)
                    </div>
                    <p className="text-rose-700 leading-relaxed text-[11px]">
                      ระบบป้องกันข้อผิดพลาด: ต้องทำการตรวจเช็คและทำเครื่องหมาย Checklist ให้ครบทุกข้อก่อนส่งขออนุมัติปิดงาน
                    </p>
                    <button 
                      type="button"
                      onClick={() => {
                        const allIds = currentChecklist.map(i => i.id);
                        const updatedTask = { ...selectedPMTask, completedChecklistIds: allIds };
                        setSelectedPMTask(updatedTask);
                        setPmTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
                      }}
                      className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>ติ๊กครบทุกข้อทันที (เพื่อทดสอบส่งงาน)</span>
                    </button>
                  </div>
                )}

                {/* ประเมินสุขภาพอุปกรณ์ (แสดงเมื่อเลือกสถานะเสร็จสิ้น/รออนุมัติ) */}
                {techFormTargetStatus === "รออนุมัติ" && (
                  <div className="animate-in fade-in duration-200 bg-amber-50/50 p-4 rounded-2xl border border-amber-200">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-amber-950">
                        ประเมินสุขภาพอุปกรณ์ส่งต่อหัวหน้า <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">ส่งต่อหัวหน้า</span>
                    </div>

                    <div className="space-y-2">
                      {[
                        { id: "เรียบร้อย", label: "1. เรียบร้อย (Completed & Good)", desc: "เครื่องปกติสมบูรณ์ 100% พร้อมใช้งานต่อ", border: "border-emerald-500 bg-emerald-50 text-emerald-950" },
                        { id: "งานติดตาม", label: "2. งานติดตาม (Follow-up / Watchlist)", desc: "มีจุดเฝ้าระวัง เช่น อุณหภูมิหรือสั่นปริ่มเกณฑ์", border: "border-amber-500 bg-amber-50 text-amber-950" },
                        { id: "งานซ่อมแซม", label: "3. งานซ่อมแซม (Defect / Action Required)", desc: "พบจุดชำรุดเสียหาย ต้องเปิดใบงานซ่อมแซม", border: "border-rose-500 bg-rose-50 text-rose-950" }
                      ].map(health => (
                        <div 
                          key={health.id}
                          onClick={() => setTechFormHealth(health.id)}
                          className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${techFormHealth === health.id ? `${health.border} shadow-xs ring-2 ring-emerald-500/20` : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"}`}
                        >
                          <div className="text-xs font-bold">{health.label}</div>
                          <div className="text-[11px] text-gray-500 mt-0.5">{health.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. แนบรูปภาพ คลิกที่นี่ (ตาม Mockup ภาพจริง และข้อ 10.5) */}
                <div>
                  {/* แสดงรูปภาพที่แนบแล้ว */}
                  {techFormPhotos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {techFormPhotos.map((url, pIdx) => (
                        <div key={pIdx} className="relative rounded-2xl overflow-hidden border border-gray-200 h-24 bg-gray-100 group">
                          <img src={url} alt={`Upload ${pIdx + 1}`} className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => setTechFormPhotos(prev => prev.filter((_, i) => i !== pIdx))}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold hover:bg-red-700 shadow-xs transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* กล่องอัปโหลดรูปภาพตาม Mockup */}
                  <input 
                    type="file" 
                    ref={techPhotoInputRef} 
                    accept="image/*" 
                    multiple 
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        const urls = Array.from(files).map(f => URL.createObjectURL(f));
                        setTechFormPhotos(prev => [...prev, ...urls]);
                      }
                    }} 
                    className="hidden" 
                  />
                  
                  <div 
                    onClick={() => techPhotoInputRef.current && techPhotoInputRef.current.click()}
                    className="border border-gray-200 bg-gray-50/80 hover:bg-gray-100 transition-all rounded-3xl p-7 flex flex-col items-center justify-center cursor-pointer text-center group"
                  >
                    <span className="text-sm font-semibold text-gray-800">แนบรูปภาพ คลิกที่นี่</span>
                    <ImageIcon className="w-12 h-12 text-gray-400 mt-3 stroke-[1.5] group-hover:scale-105 transition-transform" />
                  </div>

                  {/* ปุ่มด่วนสำหรับเพิ่มรูปตัวอย่างทดสอบ */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                    <span className="text-[11px] text-gray-400 font-medium">รูปตัวอย่างทดสอบ:</span>
                    <button 
                      type="button" 
                      onClick={() => setTechFormPhotos(prev => [...prev, 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=600'])} 
                      className="text-[11px] bg-white border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-300 px-2 py-0.5 rounded-lg transition-colors font-medium"
                    >
                      + มอเตอร์
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setTechFormPhotos(prev => [...prev, 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=600'])} 
                      className="text-[11px] bg-white border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-300 px-2 py-0.5 rounded-lg transition-colors font-medium"
                    >
                      + หน้าปัดเกจ
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setTechFormPhotos(prev => [...prev, 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=600'])} 
                      className="text-[11px] bg-white border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-300 px-2 py-0.5 rounded-lg transition-colors font-medium"
                    >
                      + แผงไฟ
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer: "ไม่ใช่" / "ยืนยัน" ตามแบบ Mockup ภาพจริง */}
              <div className="p-4 sm:p-5 border-t border-gray-100 flex items-center justify-between gap-4 shrink-0 bg-white">
                <button 
                  type="button"
                  onClick={() => setShowTechSubmitModal(false)}
                  className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ไม่ใช่
                </button>
                <button 
                  type="button"
                  disabled={techFormTargetStatus === "รออนุมัติ" && !isChecklistComplete}
                  onClick={handleTechnicianSubmit}
                  className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
                    techFormTargetStatus === "รออนุมัติ" && !isChecklistComplete
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-black hover:bg-neutral-800 text-white"
                  }`}
                >
                  ยืนยัน
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* MODAL 4: มอบหมาย/เปลี่ยนช่างผู้รับผิดชอบ (Manager Quick Reassign Modal) */}
      {/* ======================================================== */}
      {showReassignModal && taskToReassign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" /> มอบหมายช่างผู้รับผิดชอบ (โดยผู้จัดการ)
                </h3>
                <p className="text-xs text-gray-500">ใบงาน: {taskToReassign.id} • {taskToReassign.equipment}</p>
              </div>
              <button onClick={() => setShowReassignModal(false)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-blue-50/50 p-3.5 rounded-2xl border border-blue-100 text-xs text-blue-900">
                <span className="font-bold block mb-0.5">ชื่องาน: {taskToReassign.title}</span>
                <span className="text-blue-700">วันที่ปฏิบัติงาน: {taskToReassign.date}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2">
                  เลือกช่างผู้รับผิดชอบคนใหม่ (ตรวจสอบภาระงาน):
                </label>
                <div className="space-y-2">
                  {techniciansList.map(tech => {
                    const techLoad = pmTasks.filter(t => t.date === taskToReassign.date && t.assignees?.includes(tech.name)).length;
                    const isSelected = newAssigneeName === tech.name;
                    return (
                      <div 
                        key={tech.name}
                        onClick={() => setNewAssigneeName(tech.name)}
                        className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${isSelected ? "border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20" : "border-gray-200 bg-white hover:bg-gray-50"}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${tech.color} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                            {tech.avatar}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-gray-900">{tech.name}</div>
                            <div className="text-[11px] text-gray-500">{tech.role}</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${techLoad >= 3 ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-emerald-100 text-emerald-800 border-emerald-200"}`}>
                            {techLoad} งานวันนี้
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setShowReassignModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                ยกเลิก
              </button>
              <button 
                onClick={() => {
                  const updatedTask = {
                    ...taskToReassign,
                    assignees: [newAssigneeName],
                    timeline: [
                      {
                        status: taskToReassign.status,
                        date: "11 ก.ค. 69",
                        time: "ขณะนี้",
                        user: "ผู้จัดการแผนกวิศวกรรม",
                        comment: `เปลี่ยนผู้รับผิดชอบงานเป็น ${newAssigneeName}`
                      },
                      ...taskToReassign.timeline
                    ]
                  };
                  setPmTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
                  if (selectedPMTask?.id === updatedTask.id) {
                    setSelectedPMTask(updatedTask);
                  }
                  setShowReassignModal(false);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                ยืนยันการมอบหมายงาน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: เพิ่ม/แก้ไขข้อมูลอุปกรณ์ และตั้งค่ารอบ PM (1M / 6M / 1Y) พร้อม Checklist */}
      {/* ======================================================== */}
      {showAddEditEqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col max-h-[92vh]">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
              <div>
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  {editingEq ? `แก้ไขข้อมูลอุปกรณ์ ${editingEq.id}` : "เพิ่มรายการอุปกรณ์ใหม่ & กำหนดรอบ PM"}
                </h3>
                <p className="text-xs text-gray-500">กำหนดรอบซ่อมบำรุง (1M / 6M / 1Y) ประเภทงาน Service และ Checklist ของแต่ละรอบ</p>
              </div>
              <button onClick={() => setShowAddEditEqModal(false)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* ข้อมูลพื้นฐานอุปกรณ์ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">รหัส/ชื่ออุปกรณ์ (Equipment ID) <span className="text-red-500">*</span></label>
                  <input 
                    type="text"
                    value={eqFormId}
                    onChange={(e) => setEqFormId(e.target.value)}
                    placeholder="เช่น AHU-04, PUMP-03, GEN-02..."
                    disabled={!!editingEq}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">หมวดหมู่ระบบ (Category) <span className="text-red-500">*</span></label>
                  <select 
                    value={eqFormCategory}
                    onChange={(e) => setEqFormCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ระบบปรับอากาศ (HVAC)">ระบบปรับอากาศ (HVAC)</option>
                    <option value="ระบบไฟฟ้า (Electrical)">ระบบไฟฟ้า (Electrical)</option>
                    <option value="ระบบประปาและสุขาภิบาล (Plumbing)">ระบบประปาและสุขาภิบาล (Plumbing)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">ตำแหน่งติดตั้ง (Location) <span className="text-red-500">*</span></label>
                  <input 
                    type="text"
                    value={eqFormLocation}
                    onChange={(e) => setEqFormLocation(e.target.value)}
                    placeholder="เช่น ชั้น 3 โซน Fashion, ชั้น B2 ห้องเครื่อง..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">ประเภทอุปกรณ์ (Equipment Type) <span className="text-red-500">*</span></label>
                  <input 
                    type="text"
                    value={eqFormType}
                    onChange={(e) => setEqFormType(e.target.value)}
                    placeholder="เช่น AHU (Air Handling Unit), Water Pump, Generator..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>


              </div>

              {/* การตั้งค่ารอบซ่อมบำรุง 3 รอบ (1M, 6M, 1Y) - ไม่ต้องตั้งครบทั้ง 3 ก็ได้ */}
              <div className="border-t border-gray-200 pt-5 space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <ClipboardCheck className="w-4 h-4 text-blue-600" />
                      ตั้งค่ารอบซ่อมบำรุงประจำอุปกรณ์ (เปิดใช้งานได้ทั้ง 1M, 6M, 1Y หรือเลือกเฉพาะรอบที่ต้องการ)
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">ในหนึ่งอุปกรณ์มีรอบซ่อมบำรุงได้หลายรอบ สามารถระบุประเภทงาน Service และรายการ Checklist ในแต่ละรอบได้</p>
                </div>

                {[
                  { key: "1M", title: "รอบ 1 เดือน (1M - Monthly Routine)", defaultTypes: ["filter", "belt", "electrical"] },
                  { key: "6M", title: "รอบ 6 เดือน (6M - Semi-Annual)", defaultTypes: ["coil", "motor", "lubricant"] },
                  { key: "1Y", title: "รอบ 1 ปี (1Y - Annual Overhaul)", defaultTypes: ["belt", "motor", "electrical"] }
                ].map(({ key, title }) => {
                  const cycleConf = eqCyclesConfig[key] || { enabled: false, serviceTypeIds: [], checklistStr: "" };
                  const isEnabled = cycleConf.enabled;

                  return (
                    <div key={key} className={`p-4 rounded-2xl border-2 transition-all ${isEnabled ? "border-blue-400 bg-blue-50/20" : "border-gray-200 bg-gray-50 opacity-75"}`}>
                      <div className="flex items-center justify-between mb-3">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={isEnabled} 
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setEqCyclesConfig(prev => ({
                                ...prev,
                                [key]: { ...prev[key], enabled: checked }
                              }));
                            }}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" 
                          />
                          <span className={`text-xs font-bold ${isEnabled ? "text-blue-900" : "text-gray-600"}`}>{title}</span>
                        </label>
                        <span className={`text-xs px-2 py-0.5 rounded font-bold ${isEnabled ? "bg-blue-100 text-blue-800" : "bg-gray-200 text-gray-600"}`}>
                          {isEnabled ? "เปิดใช้งานรอบนี้" : "ปิด"}
                        </span>
                      </div>

                      {isEnabled && (
                        <div className="space-y-3 pt-2 border-t border-blue-100">
                          {/* เลือกประเภทงาน Service ในรอบนี้ */}
                          <div>
                            <span className="text-xs font-bold text-gray-700 block mb-1.5">เลือกประเภทงาน Service ในรอบนี้:</span>
                            <div className="flex flex-wrap gap-2">
                              {Object.values(SERVICE_TYPES_CONFIG).map(st => {
                                const StIcon = st.icon;
                                const isSelected = cycleConf.serviceTypeIds.includes(st.id);
                                return (
                                  <button
                                    key={st.id}
                                    type="button"
                                    onClick={() => {
                                      const current = cycleConf.serviceTypeIds;
                                      const updated = isSelected ? current.filter(id => id !== st.id) : [...current, st.id];
                                      setEqCyclesConfig(prev => ({
                                        ...prev,
                                        [key]: { ...prev[key], serviceTypeIds: updated }
                                      }));
                                    }}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-2xs ${isSelected ? "bg-blue-600 text-white border-blue-600 ring-2 ring-blue-500/20" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}
                                  >
                                    <StIcon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-gray-500"}`} />
                                    <span>{st.shortName}</span>
                                    {isSelected && <Check className="w-3.5 h-3.5 ml-0.5 text-white stroke-[3]" />}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* รายการ Checklist ในรอบนี้ */}
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-bold text-gray-700">Checklist ที่ต้องตรวจในรอบนี้ (1 บรรทัด = 1 ข้อ):</span>
                              <span className="text-[11px] text-gray-400 font-mono">แสดงทุกบรรทัด ({cycleConf.checklistStr.split("\n").filter(l => l.trim()).length} ข้อ)</span>
                            </div>
                            <textarea 
                              rows="6"
                              value={cycleConf.checklistStr}
                              onChange={(e) => {
                                const val = e.target.value;
                                setEqCyclesConfig(prev => ({
                                  ...prev,
                                  [key]: { ...prev[key], checklistStr: val }
                                }));
                              }}
                              placeholder="พิมพ์รายการตรวจเช็ค 1 บรรทัดต่อ 1 ข้อ... เช่น\nตรวจเช็คการสั่นสะเทือน\nล้างทำความสะอาดแผ่นกรองอากาศ\nวัดกระแสไฟฟ้า"
                              className="w-full p-3 border border-gray-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-blue-500 font-sans leading-relaxed"
                            ></textarea>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setShowAddEditEqModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                ยกเลิก
              </button>
              <button 
                onClick={() => {
                  if (!eqFormId.trim()) return;
                  const activeCycles = Object.entries(eqCyclesConfig).filter(([_, conf]) => conf.enabled);
                  const activeCyclesMap = {};
                  activeCycles.forEach(([cKey, conf]) => {
                    activeCyclesMap[cKey] = {
                      cycleLabel: cKey === "1M" ? "ราย 1 เดือน (1M)" : cKey === "6M" ? "ราย 6 เดือน (6M)" : "ราย 1 ปี (1Y)",
                      serviceTypeIds: conf.serviceTypeIds.length > 0 ? conf.serviceTypeIds : ["filter"],
                      titleTemplate: `${eqFormId.toUpperCase().trim()}`,
                      checklist: conf.checklistStr.split("\n").filter(l => l.trim()).map((line, idx) => ({
                        id: `${eqFormId.toLowerCase()}-${cKey.toLowerCase()}-${idx+1}`,
                        text: line.trim(),
                        serviceTypeId: conf.serviceTypeIds[0] || "filter"
                      }))
                    };
                  });

                  const targetId = editingEq ? editingEq.id : eqFormId.toUpperCase().trim();
                  if (!targetId) return;

                  // บันทึกและอัปเดต Dynamic Profile Registry
                  dynamicEquipmentProfilesRegistry[targetId] = {
                    category: eqFormCategory,
                    type: eqFormType || (eqFormCategory.includes("HVAC") ? "AHU (Air Handling Unit)" : eqFormCategory.includes("Electrical") ? "Generator" : "Water Pump"),
                    cycles: activeCyclesMap
                  };

                  if (editingEq) {
                    setEquipmentsList(prev => prev.map(e => e.id === editingEq.id ? {
                      ...e,
                      category: eqFormCategory,
                      type: eqFormType || e.type,
                      location: eqFormLocation,
                      interval: eqFormInterval
                    } : e));
                  } else {
                    const profileKey = targetId.startsWith("AHU") ? "AHU" : targetId.startsWith("GEN") ? "Generator" : targetId.startsWith("PUMP") ? "Pump" : targetId.startsWith("CH") ? "Chiller" : "AHU";
                    const newEq = {
                      id: targetId,
                      profileKey,
                      category: eqFormCategory,
                      type: eqFormType || (eqFormCategory.includes("HVAC") ? "AHU (Air Handling Unit)" : eqFormCategory.includes("Electrical") ? "Generator" : "Water Pump"),
                      location: eqFormLocation || "ชั้น 1 โซนกลาง",
                      interval: eqFormInterval,
                      isArchived: false
                    };
                    setEquipmentsList(prev => [newEq, ...prev]);
                  }
                  setShowAddEditEqModal(false);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                {editingEq ? "บันทึกการแก้ไขอุปกรณ์" : "บันทึกและสร้างอุปกรณ์ใหม่"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: ยืนยันยกเลิกใช้งานอุปกรณ์ (Soft Delete Confirmation) */}
      {/* ======================================================== */}
      {showDeleteEqModal && eqToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-100 bg-rose-50/50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">ยกเลิกใช้งานอุปกรณ์ (Soft Delete)</h3>
                  <p className="text-xs text-rose-700 font-semibold">{eqToDelete.id} • {eqToDelete.category}</p>
                </div>
              </div>
              <button onClick={() => setShowDeleteEqModal(false)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3 text-xs text-gray-600 leading-relaxed">
              <p className="font-bold text-gray-800 text-sm">
                คุณต้องการยกเลิกการใช้งานอุปกรณ์ "{eqToDelete.id}" ใช่หรือไม่?
              </p>
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs space-y-1.5">
                <span className="font-bold flex items-center gap-1.5 text-amber-800">
                  <Info className="w-4 h-4 text-amber-600 shrink-0" />
                  ระบบจะใช้วิธี Soft Delete (เก็บรักษาประวัติย้อนหลัง):
                </span>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  • ประวัติการบำรุงรักษาในอดีต ({pmTasks.filter(t => t.equipment === eqToDelete.id).length} ใบงาน) จะไม่สูญหาย และสามารถเปิดดูประวัติย้อนหลังได้ตลอดเวลา<br/>
                  • อุปกรณ์จะถูกย้ายไปอยู่หมวด "อุปกรณ์ที่ยกเลิกใช้งานแล้ว" ท้ายหน้าจอ และไม่สามารถสร้างใบงานใหม่ได้จนกว่าจะกดกู้คืน
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteEqModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                ยกเลิก
              </button>
              <button 
                onClick={() => {
                  setEquipmentsList(prev => prev.map(e => e.id === eqToDelete.id ? { ...e, isArchived: true } : e));
                  setShowDeleteEqModal(false);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-sm flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                ยืนยันยกเลิกใช้งานอุปกรณ์
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );

  // Helper สำหรับ Render การ์ด Kanban
  function renderKanbanCard(task, isHighlight = false) {
    const isSelected = selectedPMTask?.id === task.id;
    return (
      <div 
        key={task.id}
        onClick={() => { setSelectedPMTask(task); setCurrentView('pm-detail'); }}
        className={`bg-white p-3.5 rounded-2xl border transition-all cursor-pointer group shadow-2xs hover:shadow-md ${isSelected ? 'ring-2 ring-blue-500 border-blue-500' : isHighlight ? 'border-amber-300' : 'border-gray-200'}`}
      >
        <div className="flex justify-between items-start gap-1 mb-1.5">
          <span className="text-xs font-bold text-blue-600 group-hover:underline">{task.id}</span>
          <span className="text-xs bg-gray-100 text-gray-700 font-semibold px-2 py-0.2 rounded-full">{task.cycle}</span>
        </div>

        <h4 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug mb-2">{task.title}</h4>

        {/* แท็กประเภทงาน Service ในการ์ด */}
        <div className="flex flex-wrap gap-1 mb-2">
          {task.serviceTypeIds.map(stId => {
            const st = getServiceTypeInfo(stId);
            return (
              <span key={stId} className="px-1.5 py-0.2 rounded bg-gray-50 text-xs font-medium text-gray-600 border border-gray-200">
                {st.shortName}
              </span>
            );
          })}
        </div>

        {/* แถบแจ้งเตือนเมื่อถูกส่งกลับแก้ไข */}
        {task.status === 'ส่งกลับแก้ไข' && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-1.5 mb-2 text-xs text-rose-700 font-semibold flex items-center gap-1">
            <Undo2 className="w-3 h-3 shrink-0" />
            <span className="truncate">ตีกลับ: {task.managerReviewNote || 'แก้ไขข้อมูล'}</span>
          </div>
        )}

        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setTaskToReassign(task);
              setNewAssigneeName(task.assignees[0] || "EMP สมชาย (ช่างแอร์)");
              setShowReassignModal(true);
            }}
            className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium hover:bg-gray-100 px-1.5 py-0.5 rounded transition-colors group/btn"
            title="คลิกเพื่อเปลี่ยนผู้รับผิดชอบงาน"
          >
            <User className="w-3.5 h-3.5 text-gray-400 group-hover/btn:text-blue-600" />
            <span className="truncate max-w-[90px]">{task.assignees[0]?.split(' ')[1] || 'ช่าง'}</span>
            <Edit className="w-2.5 h-2.5 text-gray-400 opacity-0 group-hover/btn:opacity-100" />
          </button>
          
          {task.status !== 'รอดำเนินการ' && task.status !== 'กำลังดำเนินการ' && task.technicianHealthAssessment && (
            <span className={`px-2 py-0.5 rounded-full font-bold border ${getHealthBadgeStyle(task.technicianHealthAssessment)}`}>
              {task.technicianHealthAssessment}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Helpers สีของ Badge
  function getStatusBadgeStyle(status) {
    switch (status) {
      case 'อนุมัติแล้ว': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'รออนุมัติ': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'ส่งกลับแก้ไข': return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'กำลังดำเนินการ': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  function getHealthBadgeStyle(health) {
    switch (health) {
      case 'เรียบร้อย': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'งานติดตาม': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'งานซ่อมแซม': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  }
}
