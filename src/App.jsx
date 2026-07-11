import React, { useState, useMemo } from 'react';
import { 
  Search, ChevronDown, ChevronRight, Calendar, 
  RefreshCw, Copy, Clock, Settings, PieChart, 
  FileText, PanelLeftClose, User, Plus, CheckCircle2, AlertTriangle, CalendarDays,
  Image as ImageIcon, PhoneCall, Info, CheckSquare, Edit, X, ChevronLeft, Wrench, Layers,
  Check, MessageCircle, Send, Paperclip, Smile, ExternalLink, MoreVertical
} from 'lucide-react';

const initialReports = [
  {
    id: "#2026-3D228DDF",
    title: "รบกวนงานระบบเปลี่ยนแบตเตอรี่ไฟ emergency ข้าว st8 ชั้น b2 ให้ด้วยครับ ศูนย์สื่อสาร ชั้น อาคาร A ชั้น B1 ห้อง ออฟฟิศ โดย ดิษยาวัตร1111",
    dateCreated: "11 ก.ค. 69 19:06 น.",
    dateUpdated: "11 ก.ค. 69 19:07 น.",
    status: "รับเรื่องแล้ว",
    category: "ไฟฟ้า / สื่อสาร / ระบบ BAS",
    department: "Emporium (TR), Emporium, The Mall Group",
    timeAgo: "2 ชั่วโมงที่แล้ว",
    image: "https://images.unsplash.com/photo-1595844730298-b960fad97301?auto=format&fit=crop&q=80&w=200&h=150"
  },
  {
    id: "#2026-6478E7EF",
    title: "เปลี่ยนแบตเตอรี่ไฟ emergency ภายในประตูหนีไฟ ST9 ชั้น B2 ศูนย์สื่อสาร ชั้น อาคาร A ชั้น B1 ห้อง ออฟฟิศ โดย ภูธเนศ",
    dateCreated: "11 ก.ค. 69 18:03 น.",
    dateUpdated: "11 ก.ค. 69 18:33 น.",
    status: "รับเรื่องแล้ว",
    category: "ไฟฟ้า / สื่อสาร / ระ...",
    department: "Emporium (TR)",
    timeAgo: "3 ชั่วโมงที่แล้ว",
    image: "https://images.unsplash.com/photo-1541888086925-0c770f44bc19?auto=format&fit=crop&q=80&w=200&h=150"
  }
];

// ปรับปรุง Mock Data สำหรับห้องแชทให้รองรับ Flex และ Image
const mockChats = [
  {
    id: "chat-1",
    ticketId: "#2026-3D228DDF",
    status: "รอรับเรื่อง", 
    category: "ไฟฟ้า / สื่อสาร / ระบบ BAS",
    lastMessageTime: "17:40 น.",
    unread: true,
    messages: [
      { id: 1, sender: 'admin', type: 'text', text: 'ขอบคุณครับ กรุณาส่งภาพประกอบ 1 ภาพ\nThank you. Please send 1 photo.', time: '17:35 น.', isRead: true },
      { id: 2, sender: 'user', type: 'text', text: 'ตอนนี้กำลังดำเนินการตรวจสอบเบื้องต้นครับ', time: '17:40 น.' },
      { id: 3, sender: 'admin', type: 'text', text: 'รับทราบครับ หากได้ความคืบหน้าแจ้งได้เลยครับ', time: '17:42 น.', isRead: false }
    ]
  },
  {
    id: "chat-2",
    ticketId: "#2026-6478E7EF",
    status: "รับเรื่องแล้ว",
    category: "ไฟฟ้า / สื่อสาร",
    lastMessageTime: "เมื่อวาน",
    unread: false,
    messages: [
      { id: 1, sender: 'user', type: 'text', text: 'แจ้งเปลี่ยนแบตครับ บริเวณประตูหนีไฟ ST9', time: '18:00 น.' },
      { id: 2, sender: 'admin', type: 'text', text: 'รับทราบครับ ช่างกำลังเตรียมอุปกรณ์และกำลังเข้าไปดำเนินการครับ', time: '18:15 น.', isRead: true }
    ]
  }
];

const mockPMTasks = [
  { 
    id: "PM-2026-001", date: '2026-07-11', title: 'ตรวจเช็คระบบปรับอากาศ AHU-01', description: 'ทำความสะอาดฟิลเตอร์และเช็คกระแสไฟ', equipment: 'AHU-01', status: 'กำลังดำเนินการ',
    lastUpdated: '11 ก.ค. 69 10:30 น.',
    assignees: ['EMP สมชาย (ช่างแอร์)', 'EMP วินัย (ผู้ช่วย)'],
    timeline: [
      { status: 'กำลังดำเนินการ', date: '11 ก.ค. 69', time: '10:30น.', user: 'EMP สมชาย (ช่างแอร์)', comment: 'กำลังทำความสะอาดฟิลเตอร์ พบว่ามีฝุ่นสะสมมาก และกำลังเช็คกระแสไฟมอเตอร์พัดลม', image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=200&h=150' },
      { status: 'รอดำเนินการ', date: '10 ก.ค. 69', time: '08:00น.', user: 'ระบบอัตโนมัติ', comment: 'สร้างกำหนดการ PM ประจำเดือน' }
    ]
  },
  { 
    id: "PM-2026-002", date: '2026-07-11', title: 'ตรวจเช็ค Generator ประจำเดือน', description: 'Run test no load 15 mins', equipment: 'GEN-01', status: 'เสร็จสิ้น',
    lastUpdated: '11 ก.ค. 69 09:15 น.',
    assignees: ['EMP สมหญิง (ช่างไฟ)'],
    timeline: [
      { status: 'เสร็จสิ้น', date: '11 ก.ค. 69', time: '09:15น.', user: 'EMP สมหญิง (ช่างไฟ)', comment: 'Run test ปกติ ไม่พบความร้อนสะสมหรือเสียงผิดปกติ เปลี่ยนถ่ายน้ำมันเครื่องเรียบร้อย ทำความสะอาดพื้นที่โดยรอบ', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=200&h=150' },
      { status: 'รอดำเนินการ', date: '10 ก.ค. 69', time: '08:00น.', user: 'ระบบอัตโนมัติ', comment: 'สร้างกำหนดการ PM ประจำเดือน' }
    ]
  },
  { 
    id: "PM-2026-004", date: '2026-05-15', title: 'ตรวจเช็คระบบปรับอากาศ AHU-02 (รอบก่อน)', description: 'ทำความสะอาดฟิลเตอร์ประจำเดือน', equipment: 'AHU-02', status: 'เสร็จสิ้น',
    lastUpdated: '15 พ.ค. 69 11:30 น.',
    assignees: ['EMP สมชาย (ช่างแอร์)'],
    timeline: [
      { status: 'เสร็จสิ้น', date: '15 พ.ค. 69', time: '11:30น.', user: 'EMP สมชาย (ช่างแอร์)', comment: 'ทำความสะอาดเรียบร้อย กระแสไฟปกติ' },
    ]
  },
];

export default function App() {
  const [currentView, setCurrentView] = useState('pm-calendar');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Chat States
  const [selectedChat, setSelectedChat] = useState(mockChats[0]);
  const [chatFilter, setChatFilter] = useState('all'); // เพิ่ม State ตัวกรอง

  // PM States
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 6, 1)); // Default July 2026
  const [selectedPMDate, setSelectedPMDate] = useState('2026-07-11');
  const [selectedPMTask, setSelectedPMTask] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showPMStatusModal, setShowPMStatusModal] = useState(false);
  
  // Equipment List States
  const [searchEq, setSearchEq] = useState("");
  const [showAddEqModal, setShowAddEqModal] = useState(false);
  
  // Create PM Task States
  const [createPM_prefillEq, setCreatePM_prefillEq] = useState(null);
  const [eqSelectMode, setEqSelectMode] = useState('search'); // 'search' | 'dropdown'
  const [createPM_eqSearchStr, setCreatePM_eqSearchStr] = useState("");
  const [createPM_cat, setCreatePM_cat] = useState("");
  const [createPM_type, setCreatePM_type] = useState("");
  const [createPM_finalEq, setCreatePM_finalEq] = useState("");

  const [equipmentsData, setEquipmentsData] = useState([
    {
      category: "ระบบปรับอากาศ (HVAC)",
      types: [
        { type: "AHU (Air Handling Unit)", items: [{id:"AHU-01", interval:"รายเดือน"}, {id:"AHU-02", interval:"รายเดือน"}, {id:"AHU-03", interval:"รายเดือน"}] },
        { type: "Chiller", items: [{id:"CH-01", interval:"ราย3เดือน"}, {id:"CH-02", interval:"ราย3เดือน"}] }
      ]
    },
    {
      category: "ระบบไฟฟ้า (Electrical)",
      types: [
        { type: "Generator", items: [{id:"GEN-01", interval:"รายเดือน"}] },
        { type: "MDB (Main Distribution Board)", items: [{id:"MDB-01", interval:"รายปี"}, {id:"MDB-02", interval:"รายปี"}] }
      ]
    },
    {
      category: "ระบบประปาและสุขาภิบาล (Plumbing)",
      types: [
        { type: "Water Pump", items: [{id:"PUMP-01", interval:"รายสัปดาห์"}, {id:"PUMP-02", interval:"รายสัปดาห์"}] }
      ]
    }
  ]);

  const isOverdue = (lastDateStr, interval) => {
    if (!lastDateStr || lastDateStr === '-') return true; 
    
    const lastDate = new Date(lastDateStr);
    let dueDate = new Date(lastDate);
    
    if (interval === 'รายสัปดาห์') dueDate.setDate(dueDate.getDate() + 7);
    else if (interval === 'รายเดือน') dueDate.setMonth(dueDate.getMonth() + 1);
    else if (interval === 'ราย3เดือน') dueDate.setMonth(dueDate.getMonth() + 3);
    else if (interval === 'รายปี') dueDate.setFullYear(dueDate.getFullYear() + 1);

    const todayMock = new Date(2026, 6, 15); // July 15, 2026
    return todayMock > dueDate;
  };

  const flattenEquipments = useMemo(() => {
    let all = [];
    equipmentsData.forEach(cat => {
      cat.types.forEach(t => {
        t.items.forEach(item => {
          all.push({ ...item, type: t.type, category: cat.category });
        });
      });
    });
    return all;
  }, [equipmentsData]);

  const renderCalendar = () => {
    const days = [];
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="bg-white min-h-[100px] p-2 opacity-50"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayTasks = mockPMTasks.filter(task => task.date === dateStr);
      const totalCount = dayTasks.length;
      const doneCount = dayTasks.filter(task => task.status === 'เสร็จสิ้น').length;
      const pendingCount = totalCount - doneCount;

      days.push(
        <div key={i} className="min-h-[100px] bg-white border border-gray-100 p-2 relative hover:bg-gray-50 cursor-pointer transition-colors group">
          <span className={`text-sm ${dateStr === '2026-07-11' ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold' : 'text-gray-600'}`}>{i}</span>
          {totalCount > 0 && (
            <div className="mt-2 flex flex-col gap-1">
              {pendingCount > 0 && (
                  <div className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium truncate">รอทำ: {pendingCount}</div>
              )}
              {doneCount > 0 && (
                <div className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium truncate">เสร็จ: {doneCount}</div>
              )}
            </div>
          )}
          {totalCount > 0 && (
             <div onClick={(e) => { 
                 e.stopPropagation(); 
                 setSelectedPMDate(dateStr); 
                 setCurrentView('pm-list'); 
             }} className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 text-white text-[10px] px-2 py-1 rounded shadow-sm">
                ดูรายการ
             </div>
          )}
        </div>
      );
    }
    return days;
  };

  const renderSidebar = () => (
    <aside className="w-72 bg-white h-full flex flex-col border-r border-gray-200 overflow-y-auto shrink-0">
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-red-600 font-bold text-2xl tracking-tighter">
          <span className="italic">M</span>
          <span className="text-sm font-semibold tracking-normal text-black mt-2 uppercase">The Mall</span>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded-md">
          <PanelLeftClose className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <nav className="flex-1 px-4 pb-4">
        {/* เรื่องแจ้ง */}
        <div 
          onClick={() => setCurrentView('tickets')}
          className={`${(currentView === 'tickets' || currentView === 'ticket-detail' || currentView === 'chat') ? 'bg-[#1a1a1a] text-white' : 'text-gray-700 hover:bg-gray-100'} rounded-xl flex items-center justify-between p-3 mb-2 cursor-pointer transition-colors shadow-sm`}
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5" />
            <span className="font-medium">เรื่องแจ้ง</span>
          </div>
          <ChevronDown className="w-4 h-4" />
        </div>

        <div className="relative ml-5 pl-5 border-l border-gray-200 flex flex-col gap-1 mb-6 mt-2">
          <div 
            onClick={() => setCurrentView('tickets')}
            className={`py-2.5 px-3 text-sm rounded-lg cursor-pointer font-medium relative ${currentView === 'tickets' || currentView === 'ticket-detail' ? 'text-white bg-[#4b5563]' : 'text-gray-600 hover:bg-gray-50'}`}
          >
             {(currentView === 'tickets' || currentView === 'ticket-detail') && <div className="absolute -left-[25px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black border-2 border-[#f3f4f6]"></div>}
            รายการทั้งหมด
          </div>
          
          {/* เมนูห้องแชท */}
          <div 
            onClick={() => setCurrentView('chat')}
            className={`py-2.5 px-3 text-sm rounded-lg cursor-pointer font-medium relative flex items-center justify-between ${currentView === 'chat' ? 'text-white bg-[#4b5563]' : 'text-gray-600 hover:bg-gray-50'}`}
          >
             {currentView === 'chat' && <div className="absolute -left-[25px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black border-2 border-[#f3f4f6]"></div>}
             ห้องแชท (เจ้าหน้าที่)
             {/* Unread Badge Indicator */}
             <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          </div>
        </div>

        {/* งานตรวจเชิงป้องกัน (PM) */}
        <div 
          onClick={() => setCurrentView('pm-calendar')}
          className={`${currentView.startsWith('pm-') ? 'bg-[#1a1a1a] text-white' : 'text-gray-700 hover:bg-gray-100'} rounded-xl flex items-center justify-between p-3 mb-2 cursor-pointer transition-colors shadow-sm`}
        >
          <div className="flex items-center gap-3">
            <CalendarDays className="w-5 h-5" />
            <span className="font-medium text-sm">จัดการงาน PM</span>
          </div>
          <ChevronDown className={`w-4 h-4 ${currentView.startsWith('pm-') ? 'text-white' : 'text-gray-400'}`} />
        </div>

        <div className="relative ml-5 pl-5 border-l border-gray-200 flex flex-col gap-1 mb-6 mt-2">
          <div onClick={() => setCurrentView('pm-calendar')} className={`py-2.5 px-3 text-sm rounded-lg cursor-pointer font-medium relative ${currentView === 'pm-calendar' ? 'text-white bg-[#4b5563]' : 'text-gray-600 hover:bg-gray-50'}`}>
             {currentView === 'pm-calendar' && <div className="absolute -left-[25px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black border-2 border-[#f3f4f6]"></div>}
            ปฏิทิน
          </div>
          <div onClick={() => setCurrentView('pm-list')} className={`py-2.5 px-3 text-sm rounded-lg cursor-pointer font-medium relative ${currentView === 'pm-list' || currentView === 'pm-detail' ? 'text-white bg-[#4b5563]' : 'text-gray-600 hover:bg-gray-50'}`}>
             {(currentView === 'pm-list' || currentView === 'pm-detail') && <div className="absolute -left-[25px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black border-2 border-[#f3f4f6]"></div>}
            รายการ PM
          </div>
          <div onClick={() => { setCurrentView('pm-equipment'); setSelectedEquipment(null); }} className={`py-2.5 px-3 text-sm rounded-lg cursor-pointer font-medium relative ${currentView === 'pm-equipment' ? 'text-white bg-[#4b5563]' : 'text-gray-600 hover:bg-gray-50'}`}>
             {currentView === 'pm-equipment' && <div className="absolute -left-[25px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black border-2 border-[#f3f4f6]"></div>}
            รายการอุปกรณ์
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 cursor-pointer text-gray-700">
            <div className="flex items-center gap-3"><Settings className="w-5 h-5" /><span className="font-medium text-sm">ตั้งค่า</span></div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 cursor-pointer text-gray-700">
            <div className="flex items-center gap-3"><PieChart className="w-5 h-5" /><span className="font-medium text-sm">สถิติ</span></div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </nav>
    </aside>
  );

  const renderAddEquipmentModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 pb-4 flex justify-between items-center border-b border-gray-100">
          <div className="w-full font-bold text-xl text-gray-800 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" /> เพิ่มรายการอุปกรณ์
          </div>
          <button onClick={() => setShowAddEqModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">หมวดหมู่ระบบ (Category) <span className="text-red-500">*</span></label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm">
              <option>เลือกระบบ...</option>
              {equipmentsData.map(c => <option key={c.category}>{c.category}</option>)}
            </select>
          </div>
          <div>
             <label className="block text-sm font-bold text-gray-800 mb-2">ประเภทอุปกรณ์ (Type) <span className="text-red-500">*</span></label>
             <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm">
               <option>เลือกประเภท...</option>
               <option>AHU (Air Handling Unit)</option>
               <option>Chiller</option>
               <option>Generator</option>
               <option>Water Pump</option>
             </select>
          </div>
          <div>
             <label className="block text-sm font-bold text-gray-800 mb-2">รหัส/ชื่ออุปกรณ์ (Name/ID) <span className="text-red-500">*</span></label>
             <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="เช่น AHU-05" />
          </div>
          <div>
             <label className="block text-sm font-bold text-gray-800 mb-2">ระยะบำรุงรักษาปกติ (Maintenance Interval) <span className="text-red-500">*</span></label>
             <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm">
               <option>รายสัปดาห์</option>
               <option>รายเดือน</option>
               <option>ราย3เดือน</option>
               <option>รายปี</option>
             </select>
          </div>
        </div>
        
        <div className="p-6 flex gap-3 border-t border-gray-100 bg-gray-50">
          <button onClick={() => setShowAddEqModal(false)} className="flex-1 py-3 px-4 text-gray-600 bg-white border border-gray-300 font-medium rounded-xl hover:bg-gray-50 transition-colors">ยกเลิก</button>
          <button onClick={() => setShowAddEqModal(false)} className="flex-[2] py-3 px-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-md">บันทึกอุปกรณ์</button>
        </div>
      </div>
    </div>
  );

  const renderStatusModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 pb-4 flex justify-between items-center text-center relative border-b border-gray-100">
          <div className="w-full font-bold text-lg text-gray-800">
            {selectedTicket?.id}
          </div>
          <button onClick={() => setShowStatusModal(false)} className="absolute right-6 p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <label className="block text-[15px] font-bold text-gray-800 mb-2">สถานะ:</label>
            <div className="relative">
              <select className="block w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 appearance-none font-medium">
                <option>รอรับเรื่อง</option>
                <option>รับเรื่องแล้ว</option>
                <option>กำลังดำเนินการ</option>
                <option>เสร็จสิ้น</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-[15px] font-bold text-gray-800 mb-2">อธิบายเพิ่มเติม (จำเป็น)</label>
            <textarea rows={4} className="block w-full p-4 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 resize-none" placeholder="เช่น สิ่งที่จะดำเนินการ หรือระยะเวลา"></textarea>
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors group">
             <div className="text-gray-600 font-medium mb-3">แนบรูปภาพ คลิกที่นี่</div>
             <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
               <ImageIcon className="w-8 h-8" />
             </div>
          </div>
        </div>
        <div className="p-6 flex gap-4 border-t border-gray-100 bg-white">
          <button onClick={() => setShowStatusModal(false)} className="flex-1 py-3.5 px-4 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors">ไม่ใช่</button>
          <button onClick={() => setShowStatusModal(false)} className="flex-[2] py-3.5 px-4 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-md">ยืนยัน</button>
        </div>
      </div>
    </div>
  );

  const renderPMStatusModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 pb-4 flex justify-between items-center text-center relative border-b border-gray-100">
          <div className="w-full font-bold text-lg text-gray-800">อัปเดตสถานะ {selectedPMTask?.id}</div>
          <button onClick={() => setShowPMStatusModal(false)} className="absolute right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <label className="block text-[15px] font-bold text-gray-800 mb-2">สถานะงาน PM:</label>
            <div className="relative">
              <select className="block w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 appearance-none font-medium">
                <option>รอดำเนินการ</option>
                <option>กำลังดำเนินการ</option>
                <option>เสร็จสิ้น</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none"><ChevronDown className="h-5 w-5 text-gray-500" /></div>
            </div>
          </div>
          <div>
            <label className="block text-[15px] font-bold text-gray-800 mb-2">รายละเอียดการตรวจเช็ค</label>
            <textarea rows={4} className="block w-full p-4 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 resize-none" placeholder="เช่น ทำการตรวจสอบเรียบร้อย ไม่พบสิ่งผิดปกติ..."></textarea>
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors group">
             <div className="text-gray-600 font-medium mb-3">แนบรูปภาพ (ออปชั่น)</div>
             <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors"><ImageIcon className="w-8 h-8" /></div>
          </div>
        </div>
        <div className="p-6 flex gap-4 border-t border-gray-100 bg-white">
          <button onClick={() => setShowPMStatusModal(false)} className="flex-1 py-3.5 px-4 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors">ยกเลิก</button>
          <button onClick={() => setShowPMStatusModal(false)} className="flex-[2] py-3.5 px-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-md">บันทึกการตรวจเช็ค</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f3f4f6] font-sans text-gray-800">
      {renderSidebar()}

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="p-4 flex justify-between items-center shrink-0 bg-[#f3f4f6] z-10 sticky top-0">
          <div className="bg-white rounded-full px-4 py-2 flex items-center gap-2 shadow-sm border border-gray-100 cursor-pointer">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden"><span className="text-[10px] font-bold">EMP</span></div>
            <span className="font-medium text-sm text-gray-700">Emporium</span><ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
          </div>
          <div className="bg-white rounded-full p-1 shadow-sm border border-gray-100 cursor-pointer">
             <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80" alt="User" className="w-8 h-8 rounded-full object-cover" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 pb-8">
          
          {/* VIEW: TICKETS LIST (Original) */}
          {currentView === 'tickets' && (
            <div className="animate-in fade-in duration-300">
              <div className="space-y-4">
                {initialReports.map((report, index) => (
                  <div key={index} onClick={() => { setSelectedTicket(report); setCurrentView('ticket-detail'); }} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex gap-4 relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow group">
                    <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-[#5a6cf3]"></div>
                    <div className="flex-1 pl-2 flex flex-col justify-between py-1">
                      <h3 className="text-[15px] font-medium text-gray-800 leading-snug mb-8 pr-4 group-hover:text-blue-600 transition-colors">{report.title}</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-6 text-sm text-gray-500 border-b border-gray-100 pb-3">
                          <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gray-400" /><span>{report.dateCreated}</span></div>
                          <div className="flex items-center gap-1.5"><RefreshCw className="w-4 h-4 text-gray-400" /><span>{report.dateUpdated}</span></div>
                        </div>
                        <div className="flex items-center gap-3 text-[13px] flex-wrap">
                          <span className="bg-[#5a6cf3] text-white px-3 py-1 rounded-full font-medium">{report.status}</span>
                          <span className="border border-gray-300 text-gray-700 px-3 py-1 rounded-full">{report.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-[180px] h-[130px] shrink-0 rounded-xl overflow-hidden shadow-sm">
                      <img src={report.image} alt="Report thumbnail" className="w-full h-full object-cover" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {}
          {/* VIEW: CHAT ROOM */}
          {currentView === 'chat' && (
            <div className="animate-in fade-in duration-300 flex h-[calc(100vh-140px)] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              
              {/* Left: Chat List */}
              <div className="w-[320px] flex flex-col border-r border-gray-200 bg-gray-50">
                 {/* Search & Filter */}
                 <div className="p-4 border-b border-gray-200 bg-white flex flex-col gap-3">
                    <div className="flex gap-4 border-b border-gray-100 pb-1">
                       <button onClick={() => setChatFilter('all')} className={`text-sm font-medium pb-2 border-b-2 transition-colors ${chatFilter === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>ทั้งหมด</button>
                       <button onClick={() => setChatFilter('unread')} className={`text-sm font-medium pb-2 border-b-2 transition-colors ${chatFilter === 'unread' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>ยังไม่ได้อ่าน</button>
                    </div>
                    <div className="relative">
                       <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                       <input type="text" placeholder="ค้นหา" className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                 </div>
                 
                 {/* Chat List Items */}
                 <div className="flex-1 overflow-y-auto">
                    {mockChats.filter(chat => chatFilter === 'all' ? true : chat.unread).map(chat => (
                      <div 
                        key={chat.id} 
                        onClick={() => setSelectedChat(chat)}
                        className={`p-4 border-b border-gray-100 cursor-pointer flex gap-3 transition-colors relative ${selectedChat.id === chat.id ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : 'hover:bg-gray-100 border-l-4 border-l-transparent'}`}
                      >
                         <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <div className="flex justify-between items-start mb-2.5">
                               <span className="font-bold text-gray-900 truncate pr-2 text-[15px]">{chat.ticketId}</span>
                               <span className="text-[11px] text-gray-400 shrink-0 mt-0.5">{chat.lastMessageTime}</span>
                            </div>
                            <div className="flex justify-between items-center">
                               <div className="flex items-center gap-2 truncate pr-2">
                                  {/* Badge สถานะ + หมวดหมู่ แทนข้อความพรีวิว */}
                                  <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${chat.status === 'รับเรื่องแล้ว' ? 'bg-[#5a6cf3] text-white' : chat.status === 'เสร็จสิ้น' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                                    {chat.status}
                                  </span>
                                  <span className="text-xs text-gray-500 truncate">{chat.category}</span>
                               </div>
                               {chat.unread && <div className="w-2.5 h-2.5 bg-green-500 rounded-full shrink-0"></div>}
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Right: Active Chat Room */}
              <div className="flex-1 flex flex-col bg-white">
                 {/* Chat Header */}
                 <div className="px-6 py-4 border-b border-gray-200 bg-white shadow-sm z-10 flex flex-col gap-3">
                    {(() => {
                        const ticket = initialReports.find(t => t.id === selectedChat.ticketId);
                        return ticket ? (
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h2 className="font-bold text-lg text-gray-900">{ticket.id}</h2>
                                        <span className="px-2.5 py-0.5 text-xs font-medium bg-[#5a6cf3] text-white rounded-full">{ticket.status}</span>
                                        <span className="text-sm text-gray-600 border-l border-gray-300 pl-3">{ticket.category}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                        {ticket.title}
                                    </p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                   <button onClick={() => {
                                      setSelectedTicket(ticket);
                                      setCurrentView('ticket-detail');
                                   }} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-xl hover:bg-blue-100 transition-colors text-sm shadow-sm">
                                      <FileText className="w-4 h-4" /> ดูใบแจ้งงาน
                                   </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-500 text-sm">ไม่พบข้อมูลใบแจ้งงาน</div>
                        );
                    })()}
                 </div>

                 {/* Messages Area (รองรับ Text, Image, Flex Message) */}
                 <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f4f5f7]">
                    {selectedChat.messages.map(msg => (
                      <div key={msg.id} className={`flex flex-col ${msg.sender === 'admin' || msg.sender === 'system' ? 'items-end' : 'items-start'}`}>
                         
                         {/* Bubble: Text (User) */}
                         {msg.sender === 'user' && msg.type === 'text' && (
                           <div className="flex items-end gap-2 max-w-[70%]">
                              <div>
                                <div className="bg-white border border-gray-200 text-gray-800 p-3.5 rounded-2xl rounded-bl-none shadow-sm mb-1 text-[14px] leading-relaxed whitespace-pre-wrap">
                                  {msg.text}
                                </div>
                                <div className="text-[11px] text-gray-400 ml-1">{msg.time}</div>
                              </div>
                           </div>
                         )}

                         {/* Bubble: Image (User) */}
                         {msg.sender === 'user' && msg.type === 'image' && (
                           <div className="flex items-end gap-2 max-w-[70%]">
                              <div>
                                <div className="rounded-2xl rounded-bl-none overflow-hidden shadow-sm mb-1 border border-gray-200 bg-white p-1">
                                  <img src={msg.image} alt="Upload" className="max-w-[250px] object-cover rounded-xl" />
                                </div>
                                <div className="text-[11px] text-gray-500 mt-1 ml-2 cursor-pointer hover:underline">{msg.text}</div>
                                <div className="text-[11px] text-gray-400 ml-1 mt-1">{msg.time}</div>
                              </div>
                           </div>
                         )}

                         {/* Bubble: Text (Admin) */}
                         {msg.sender === 'admin' && msg.type === 'text' && (
                            <div className="flex items-end gap-2 max-w-[70%] flex-row-reverse">
                              <div>
                                <div className="bg-[#b3d4ff] text-blue-900 p-3.5 rounded-2xl rounded-br-none shadow-sm mb-1 text-[14px] leading-relaxed whitespace-pre-wrap">
                                  {msg.text}
                                </div>
                                <div className="text-[11px] text-gray-400 mr-1 text-right flex justify-end gap-1">
                                  {msg.isRead && <span>อ่านแล้ว</span>} {msg.time}
                                </div>
                              </div>
                            </div>
                         )}

                         {/* Bubble: Flex Message (System/Admin) */}
                         {msg.sender === 'system' && msg.type === 'flex' && (
                            <div className="flex items-end gap-2 max-w-[70%] flex-row-reverse">
                              <div>
                                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-1 w-[280px]">
                                   <div className="text-[#0056ff] font-bold text-lg mb-1">รอรับเรื่องร้องเรียน</div>
                                   <div className="text-xs text-gray-500 mb-4">รหัสอ้างอิง: {msg.ticketId.replace('#','')}</div>
                                   
                                   {(() => {
                                      const t = initialReports.find(r => r.id === msg.ticketId);
                                      return t ? (
                                        <>
                                          <div className="h-36 rounded-lg overflow-hidden mb-4 bg-gray-100">
                                            <img src={t.image} alt="Ref" className="w-full h-full object-cover" />
                                          </div>
                                          <div className="space-y-3 text-[12px] mb-5">
                                            <div className="flex"><span className="w-16 text-gray-500 font-medium shrink-0">ประเภท:</span><span className="text-gray-800 line-clamp-2">{t.category}</span></div>
                                            <div className="flex"><span className="w-16 text-gray-500 font-medium shrink-0">รายละเอียด:</span><span className="text-gray-800 line-clamp-3">{t.title}</span></div>
                                          </div>
                                        </>
                                      ) : null;
                                   })()}
                                   
                                   <button onClick={() => {
                                      const ticket = initialReports.find(t => t.id === msg.ticketId);
                                      if(ticket) {
                                        setSelectedTicket(ticket);
                                        setCurrentView('ticket-detail');
                                      }
                                   }} className="w-full py-2.5 bg-[#00895a] text-white rounded-lg font-medium text-[13px] hover:bg-[#007049] transition-colors shadow-sm">
                                      ไทม์ไลน์ / Timeline
                                   </button>
                                </div>
                                <div className="text-[11px] text-gray-400 mr-1 text-right flex justify-end gap-1">
                                  {msg.time}
                                </div>
                              </div>
                            </div>
                         )}
                      </div>
                    ))}
                 </div>

                 {/* Input Area */}
                 <div className="p-4 bg-white border-t border-gray-200">
                    <div className="flex gap-2">
                       <div className="flex-1 relative">
                          <textarea 
                             rows="1" 
                             placeholder="Enter: ส่ง, Shift + Enter: ขึ้นบรรทัดใหม่" 
                             className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none h-full overflow-hidden"
                          ></textarea>
                       </div>
                       <button className="px-5 bg-[#00c300] text-white rounded-xl hover:bg-[#00a300] transition-colors shadow-sm flex items-center justify-center">
                          <Send className="w-5 h-5" />
                       </button>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* VIEW: PM CALENDAR */}
          {currentView === 'pm-calendar' && (
             <div className="animate-in fade-in duration-300 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[600px]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">ปฏิทินงานตรวจเชิงป้องกัน (PM)</h2>
                    <div className="flex items-center gap-4 mt-2">
                        <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))} className="p-1 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
                        <p className="text-sm font-semibold text-gray-700 w-32 text-center">{calendarMonth.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}</p>
                        <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))} className="p-1 hover:bg-gray-100 rounded-full transition-colors"><ChevronRight className="w-5 h-5 text-gray-600" /></button>
                    </div>
                  </div>
                  {/* ปรับเป็นสีฟ้าและใช้คำมาตรฐาน */}
                  <button onClick={() => { setCreatePM_prefillEq(null); setCreatePM_finalEq(""); setCurrentView('pm-create'); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium">
                    <Plus className="w-4 h-4" /> เพิ่มงาน PM
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-[1px] bg-gray-200 border border-gray-200 rounded-xl overflow-hidden">
                  {['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'].map((day, i) => <div key={i} className="bg-gray-50 py-3 text-center text-sm font-semibold text-gray-700">{day}</div>)}
                  {renderCalendar()}
                </div>
             </div>
          )}

          {/* VIEW: PM LIST */}
          {currentView === 'pm-list' && (
             <div className="animate-in fade-in duration-300">
                <div className="flex justify-between items-end mb-6">
                    <div className="flex gap-4 items-end">
                        <div className="w-64">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">เลือกวันที่</label>
                            <input type="date" value={selectedPMDate} onChange={(e) => setSelectedPMDate(e.target.value)} className="block w-full px-4 py-2.5 border border-transparent rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm" />
                        </div>
                        <div className="flex-1 pb-1">
                            <h2 className="text-xl font-bold text-gray-800 mb-1">รายการบำรุงรักษา (PM)</h2>
                            <p className="text-sm text-gray-500">ประจำวันที่ {new Date(selectedPMDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                    {/* ใช้สีฟ้าและข้อความมาตรฐาน (จุดนี้ถูกต้องอยู่แล้ว) */}
                    <button onClick={() => { setCreatePM_prefillEq(null); setCurrentView('pm-create'); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium mb-0.5">
                      <Plus className="w-4 h-4" /> เพิ่มงาน PM
                    </button>
                </div>
                <div className="space-y-4">
                    {mockPMTasks.filter(t => t.date === selectedPMDate).length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 text-gray-500">ไม่มีรายการ PM ในวันนี้</div>
                    ) : (
                        mockPMTasks.filter(t => t.date === selectedPMDate).map((task, index) => (
                            <div key={index} onClick={() => { setSelectedPMTask(task); setCurrentView('pm-detail'); }} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex gap-4 relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow group">
                                <div className={`absolute left-0 top-0 bottom-0 w-[6px] ${task.status === 'เสร็จสิ้น' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                                <div className="flex-1 pl-2 flex flex-col justify-between py-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-[15px] font-medium text-gray-800 group-hover:text-blue-600 transition-colors">{task.title}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${task.status === 'เสร็จสิ้น' ? 'bg-green-100 text-green-700' : task.status === 'กำลังดำเนินการ' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{task.status}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-1">{task.description}</p>
                                    <div className="flex items-center gap-3 text-[13px] flex-wrap mt-2">
                                        <span className="border border-gray-300 text-gray-700 px-3 py-1 rounded-full flex items-center gap-1.5"><Settings className="w-3.5 h-3.5 text-gray-500" />{task.equipment}</span>
                                        <div className="flex items-center gap-1.5 text-gray-500 border-l border-gray-200 pl-3"><RefreshCw className="w-3.5 h-3.5" /><span>อัปเดตล่าสุด: {task.lastUpdated}</span></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
             </div>
          )}

          {/* VIEW: CREATE PM TICKET (Redesigned) */}
          {currentView === 'pm-create' && (
            <div className="animate-in fade-in duration-300 max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <CheckSquare className="w-6 h-6 text-blue-600" /> สร้างงานตรวจเชิงป้องกัน (PM)
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">กำหนดการบำรุงรักษาอุปกรณ์ล่วงหน้า</p>
                </div>
                
                <div className="p-6 space-y-6">
                  
                  {/* Equipment Selection Area */}
                  <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 mb-6">
                     <label className="block text-sm font-bold text-gray-800 mb-3">อุปกรณ์ที่ต้องบำรุงรักษา <span className="text-red-500">*</span></label>
                     
                     {/* If Pre-filled from Equipment List */}
                     {createPM_prefillEq ? (
                        <div className="flex items-center justify-between bg-white p-3 border border-blue-200 rounded-xl shadow-sm">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"><Settings className="w-5 h-5" /></div>
                              <div>
                                 <div className="font-bold text-gray-900">{createPM_prefillEq}</div>
                                 <div className="text-xs text-gray-500">เลือกจากหน้ารายการอุปกรณ์</div>
                              </div>
                           </div>
                           <button onClick={() => setCreatePM_prefillEq(null)} className="text-sm text-blue-600 hover:underline">เปลี่ยนอุปกรณ์</button>
                        </div>
                     ) : (
                       <>
                         <div className="flex gap-2 mb-4 bg-white p-1 rounded-lg border border-gray-200 inline-flex">
                           <button onClick={() => setEqSelectMode('search')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${eqSelectMode === 'search' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>ค้นหาด้วยชื่อ</button>
                           <button onClick={() => setEqSelectMode('dropdown')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${eqSelectMode === 'dropdown' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>เลือกตามหมวดหมู่</button>
                         </div>

                         {eqSelectMode === 'search' && (
                           <div className="relative">
                             <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                             <input type="text" value={createPM_eqSearchStr} onChange={(e) => setCreatePM_eqSearchStr(e.target.value)} placeholder="พิมพ์ชื่อหรือรหัสอุปกรณ์ เช่น AHU-01..." className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
                             {createPM_eqSearchStr && (
                               <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-20">
                                 {flattenEquipments.filter(e => e.id.toLowerCase().includes(createPM_eqSearchStr.toLowerCase())).map(eq => (
                                   <div key={eq.id} onClick={() => { setCreatePM_finalEq(eq.id); setCreatePM_eqSearchStr(""); }} className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0">
                                     <div className="font-bold text-gray-800 text-sm">{eq.id}</div>
                                     <div className="text-xs text-gray-500">{eq.category} &gt; {eq.type}</div>
                                   </div>
                                 ))}
                                 {flattenEquipments.filter(e => e.id.toLowerCase().includes(createPM_eqSearchStr.toLowerCase())).length === 0 && (
                                   <div className="px-4 py-3 text-sm text-gray-500 text-center">ไม่พบอุปกรณ์ที่ค้นหา</div>
                                 )}
                               </div>
                             )}
                             {createPM_finalEq && (
                               <div className="mt-3 inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-200 text-sm">
                                 <Check className="w-4 h-4" /> เลือกแล้ว: <strong>{createPM_finalEq}</strong>
                               </div>
                             )}
                           </div>
                         )}

                         {eqSelectMode === 'dropdown' && (
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                             <select value={createPM_cat} onChange={e => {setCreatePM_cat(e.target.value); setCreatePM_type(""); setCreatePM_finalEq("");}} className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                               <option value="">1. เลือกหมวดหมู่...</option>
                               {equipmentsData.map(c => <option key={c.category} value={c.category}>{c.category}</option>)}
                             </select>
                             <select value={createPM_type} onChange={e => {setCreatePM_type(e.target.value); setCreatePM_finalEq("");}} disabled={!createPM_cat} className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100">
                               <option value="">2. เลือกประเภท...</option>
                               {createPM_cat && equipmentsData.find(c => c.category === createPM_cat)?.types.map(t => <option key={t.type} value={t.type}>{t.type}</option>)}
                             </select>
                             <select value={createPM_finalEq} onChange={e => setCreatePM_finalEq(e.target.value)} disabled={!createPM_type} className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100">
                               <option value="">3. เลือกอุปกรณ์...</option>
                               {createPM_type && equipmentsData.find(c => c.category === createPM_cat)?.types.find(t => t.type === createPM_type)?.items.map(eq => <option key={eq.id} value={eq.id}>{eq.id}</option>)}
                             </select>
                           </div>
                         )}
                       </>
                     )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ชื่องาน PM (Title) <span className="text-red-500">*</span></label>
                    <input type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="เช่น ตรวจเช็คระบบปรับอากาศประจำเดือน" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">รายละเอียด (Description)</label>
                    <textarea rows="4" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" placeholder="ระบุรายละเอียดสิ่งที่ต้องตรวจเช็ค..."></textarea>
                  </div>

                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">วันที่กำหนด (Schedule Date) <span className="text-red-500">*</span></label>
                    <input type="date" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700" />
                  </div>

                  <div className="pt-6 flex justify-end gap-3 border-t border-gray-100">
                    <button onClick={() => setCurrentView('pm-calendar')} className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">ยกเลิก</button>
                    <button onClick={() => setCurrentView('pm-calendar')} className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm">บันทึกรายการ PM</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: EQUIPMENT LIST (รายการอุปกรณ์) */}
          {currentView === 'pm-equipment' && (
             <div className="animate-in fade-in duration-300">
                {!selectedEquipment ? (
                  <>
                    <div className="flex justify-between items-end mb-6">
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">รายการอุปกรณ์</h2>
                            <p className="text-sm text-gray-500">จัดการและดูประวัติการบำรุงรักษาอุปกรณ์ตามหมวดหมู่</p>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="relative w-64">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-4 w-4 text-gray-400" /></div>
                              <input type="text" value={searchEq} onChange={(e) => setSearchEq(e.target.value)} className="block w-full pl-10 pr-3 py-2.5 border border-transparent rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm" placeholder="ค้นหาอุปกรณ์ หรือ หมวดหมู่..." />
                            </div>
                            <button onClick={() => setShowAddEqModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium">
                              <Plus className="w-4 h-4" /> เพิ่มรายการอุปกรณ์
                            </button>
                        </div>
                    </div>

                    <div className="space-y-8">
                      {equipmentsData.map((category, catIdx) => {
                        const searchLower = searchEq.toLowerCase();
                        const isCatMatch = category.category.toLowerCase().includes(searchLower);
                        const filteredTypes = category.types.map(t => ({
                          ...t, items: isCatMatch ? t.items : t.items.filter(item => item.id.toLowerCase().includes(searchLower) || t.type.toLowerCase().includes(searchLower))
                        })).filter(t => t.items.length > 0);

                        if (filteredTypes.length === 0) return null;

                        return (
                          <div key={catIdx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                             <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                                <Layers className="w-6 h-6 text-blue-600" />
                                <h3 className="text-lg font-bold text-gray-900">{category.category}</h3>
                             </div>

                             <div className="space-y-6 pl-2">
                                {filteredTypes.map((typeObj, typeIdx) => (
                                  <div key={typeIdx}>
                                    <h4 className="text-[15px] font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div> ประเภท: {typeObj.type}
                                    </h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                      {typeObj.items.map((eqObj, eqIdx) => {
                                        const eqName = eqObj.id;
                                        const eqInterval = eqObj.interval;
                                        const history = mockPMTasks.filter(t => t.equipment === eqName);
                                        const count = history.length;
                                        history.sort((a, b) => new Date(b.date) - new Date(a.date));
                                        const lastPMDateRaw = count > 0 ? history[0].date : null;
                                        const lastPMDateDisplay = count > 0 ? new Date(lastPMDateRaw).toLocaleDateString('th-TH', { year: '2-digit', month: 'short', day: 'numeric' }) : '-';
                                        // Overdue Check
                                        const overdue = isOverdue(lastPMDateRaw, eqInterval);

                                        return (
                                          <div key={eqIdx} className={`bg-gray-50 rounded-xl border flex flex-col justify-between transition-all group ${overdue ? 'border-red-300 shadow-sm' : 'border-gray-200 hover:border-blue-300 hover:shadow-md'}`}>
                                            <div onClick={() => setSelectedEquipment(eqName)} className="p-4 cursor-pointer flex-1">
                                              <div className="flex items-start justify-between mb-3">
                                                <div className={`p-2 rounded-lg shadow-sm transition-colors ${overdue ? 'bg-red-50 text-red-500' : 'bg-white text-gray-500 group-hover:text-blue-600'}`}>
                                                  <Settings className="w-5 h-5" />
                                                </div>
                                                {overdue && (
                                                  <div className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full animate-pulse">
                                                    <AlertTriangle className="w-3 h-3" /> เลยกำหนด PM
                                                  </div>
                                                )}
                                              </div>
                                              <h5 className="text-[15px] font-bold text-gray-900 mb-2">{eqName}</h5>
                                              
                                              <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                                                <span>รอบปกติ: <span className="font-medium text-gray-700">{eqInterval}</span></span>
                                              </div>
                                              
                                              <div className="flex justify-between items-center pt-3 border-t border-gray-200 mt-2">
                                                <div className="text-xs"><span className="text-gray-500 block mb-0.5">PM ไปแล้ว</span><span className="font-semibold text-gray-800">{count} ครั้ง</span></div>
                                                <div className="text-xs text-right"><span className="text-gray-500 block mb-0.5">ล่าสุด</span><span className={`font-medium ${overdue ? 'text-red-600' : 'text-gray-800'}`}>{lastPMDateDisplay}</span></div>
                                              </div>
                                            </div>
                                            
                                            {/* CTA Button in Equipment Card: ปรับเป็นสีและคำมาตรฐานทั้งหมด */}
                                            <div className="px-4 pb-4">
                                               <button onClick={(e) => {
                                                  e.stopPropagation();
                                                  setCreatePM_prefillEq(eqName);
                                                  setCurrentView('pm-create');
                                               }} className="w-full py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors hover:bg-blue-600 hover:text-white shadow-sm">
                                                  <Plus className="w-4 h-4" /> เพิ่มงาน PM
                                               </button>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                             </div>
                          </div>
                        );
                      })}
                      
                      {searchEq && equipmentsData.every(c => c.category.toLowerCase().indexOf(searchEq.toLowerCase()) === -1 && c.types.every(t => t.type.toLowerCase().indexOf(searchEq.toLowerCase()) === -1 && t.items.every(i => i.id.toLowerCase().indexOf(searchEq.toLowerCase()) === -1))) && (
                        <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 text-gray-500">ไม่พบอุปกรณ์ หมวดหมู่ หรือประเภทที่ค้นหา</div>
                      )}
                    </div>
                  </>
                ) : (
                  // Specific Equipment History View
                  <div className="max-w-4xl mx-auto">
                    <button onClick={() => setSelectedEquipment(null)} className="flex items-center gap-2 text-gray-600 hover:text-black font-medium text-sm transition-colors mb-6"><ChevronLeft className="w-4 h-4" /> กลับหน้ารายการอุปกรณ์</button>
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Settings className="w-8 h-8" /></div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900">{selectedEquipment}</h2>
                            <p className="text-gray-500 mt-1">ประวัติการบำรุงรักษาเชิงป้องกันทั้งหมด</p>
                          </div>
                        </div>
                        {/* ปรับปุ่มเพิ่มงาน PM ในหน้ารายละเอียดอุปกรณ์เป็นสีฟ้าและมาตรฐานเดียวกัน */}
                        <button onClick={() => { setCreatePM_prefillEq(selectedEquipment); setCurrentView('pm-create'); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium">
                           <Plus className="w-4 h-4" /> เพิ่มงาน PM
                        </button>
                    </div>
                    {/* History List */}
                    <div className="space-y-4">
                      {mockPMTasks.filter(t => t.equipment === selectedEquipment).length === 0 ? (
                         <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 text-gray-500">ไม่พบประวัติการทำ PM สำหรับอุปกรณ์นี้</div>
                      ) : (
                         mockPMTasks.filter(t => t.equipment === selectedEquipment).sort((a, b) => new Date(b.date) - new Date(a.date)).map((task, index) => (
                            <div key={index} onClick={() => { setSelectedPMTask(task); setCurrentView('pm-detail'); }} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex gap-4 relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow group">
                                <div className={`absolute left-0 top-0 bottom-0 w-[6px] ${task.status === 'เสร็จสิ้น' ? 'bg-green-500' : task.status === 'กำลังดำเนินการ' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                                <div className="flex-1 pl-2 flex flex-col justify-between py-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-[15px] font-medium text-gray-800 group-hover:text-blue-600 transition-colors">{task.title}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${task.status === 'เสร็จสิ้น' ? 'bg-green-100 text-green-700' : task.status === 'กำลังดำเนินการ' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{task.status}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[13px] text-gray-500 mt-2">
                                        <div className="flex items-center gap-1.5 font-medium text-gray-700"><Calendar className="w-4 h-4 text-gray-400" />{new Date(task.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                        <div className="flex items-center gap-1.5 border-l border-gray-200 pl-3"><Wrench className="w-3.5 h-3.5" /><span>รหัสงาน: {task.id}</span></div>
                                    </div>
                                </div>
                            </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
             </div>
          )}
          
          {/* VIEW: PM DETAIL */}
          {currentView === 'pm-detail' && selectedPMTask && (
             <div className="animate-in fade-in duration-300 space-y-6 max-w-4xl">
                <button onClick={() => setCurrentView('pm-list')} className="flex items-center gap-2 text-gray-600 hover:text-black font-medium text-sm transition-colors">
                   <ChevronLeft className="w-4 h-4" /> กลับหน้ารายการ
                </button>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <CheckSquare className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                                {selectedPMTask.id}
                                <Copy className="w-4 h-4 text-gray-400 cursor-pointer" />
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">รายละเอียดงานบำรุงรักษาเชิงป้องกัน</p>
                        </div>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${selectedPMTask.status === 'เสร็จสิ้น' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {selectedPMTask.status}
                      </span>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                          <span className="block text-sm font-medium text-gray-500 mb-2">ชื่อรายการ (Title)</span>
                          <strong className="text-gray-900 text-[15px]">{selectedPMTask.title}</strong>
                      </div>
                      <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                          <span className="block text-sm font-medium text-gray-500 mb-2">วันที่กำหนด (Schedule Date)</span>
                          <strong className="text-gray-900 text-[15px] flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-600" /> {new Date(selectedPMTask.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </strong>
                      </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                          <span className="block text-sm font-medium text-gray-500 mb-2">อุปกรณ์ที่ต้องบำรุงรักษา (Equipment)</span>
                          <strong className="text-gray-900 text-[15px] flex items-center gap-2">
                              <Settings className="w-4 h-4 text-gray-600" /> {selectedPMTask.equipment}
                          </strong>
                      </div>
                      <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                          <span className="block text-sm font-medium text-gray-500 mb-2">ผู้ดำเนินการ (Assignees)</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                             {selectedPMTask.assignees?.map((assignee, idx) => (
                                <span key={idx} className="bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm">
                                  <User className="w-3.5 h-3.5 text-gray-500" /> {assignee}
                                </span>
                             ))}
                          </div>
                      </div>
                  </div>

                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 mb-8">
                      <span className="block text-sm font-medium text-gray-500 mb-2">รายละเอียด (Description)</span>
                      <p className="text-gray-700 leading-relaxed">{selectedPMTask.description}</p>
                  </div>

                  <div className="flex gap-3 border-t border-gray-100 pt-6">
                    <button onClick={() => setShowPMStatusModal(true)} className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-sm text-sm">
                      <CheckCircle2 className="w-5 h-5" /> อัปเดตสถานะการตรวจเช็ค
                    </button>
                  </div>
                </div>

                {/* PM Timeline */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[400px]">
                  <h2 className="text-xl font-bold text-gray-900 mb-8">ไทม์ไลน์การบำรุงรักษา</h2>
                  <div className="relative border-l-2 border-gray-100 ml-[120px]">
                    {selectedPMTask.timeline?.map((item, idx) => (
                      <div key={idx} className="mb-10 relative">
                        <div className="absolute -left-[144px] w-[110px] text-right">
                          <div className={`font-bold ${item.status === 'เสร็จสิ้น' ? 'text-green-600' : item.status === 'กำลังดำเนินการ' ? 'text-yellow-600' : 'text-blue-600'}`}>{item.status}</div>
                          <div className="text-gray-500 text-sm mt-1">{item.date}<br/>{item.time}</div>
                        </div>
                        <div className={`absolute w-3 h-3 rounded-full -left-[7px] top-1.5 ring-4 ring-white ${item.status === 'เสร็จสิ้น' ? 'bg-green-500' : item.status === 'กำลังดำเนินการ' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                        <div className="pl-6">
                          <div className="inline-flex bg-gray-100 px-4 py-1.5 rounded-full text-sm font-medium text-gray-800 mb-3">{item.user}</div>
                          <p className="text-gray-600 mb-4 leading-relaxed max-w-2xl">{item.comment}</p>
                          {item.image && (
                            <div className="w-[200px] h-[150px] mt-3 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                               <img src={item.image} alt="Maintenance Update" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
             </div>
          )}

          {/* VIEW: TICKET DETAIL (Original Incident Reports) */}
          {currentView === 'ticket-detail' && selectedTicket && (
             <div className="animate-in fade-in duration-300 space-y-6">
                <button onClick={() => setCurrentView('tickets')} className="flex items-center gap-2 text-gray-600 hover:text-black font-medium text-sm transition-colors">
                   <ChevronRight className="w-4 h-4 rotate-180" /> กลับหน้ารายการ
                </button>
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex gap-6">
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <h1 className="text-xl font-bold text-gray-900 tracking-tight">{selectedTicket.id}</h1>
                      <Copy className="w-4 h-4 text-gray-400 cursor-pointer" />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <span className="bg-[#5a6cf3] text-white px-3 py-1 rounded-full text-sm font-medium">{selectedTicket.status}</span>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
                        <Calendar className="w-4 h-4" />{selectedTicket.dateCreated} <span className="text-gray-400 ml-1">({selectedTicket.timeAgo})</span>
                      </div>
                    </div>
                    <div className="space-y-3 flex-1">
                      <div className="flex gap-2 text-[15px]">
                        <span className="font-semibold text-gray-800 w-32 shrink-0">ประเภทปัญหา :</span>
                        <span className="border border-gray-300 text-gray-700 px-3 py-0.5 rounded-full text-sm">{selectedTicket.category}</span>
                      </div>
                      <div className="flex gap-2 text-[15px]">
                        <span className="font-semibold text-gray-800 w-32 shrink-0">หน่วยงานรับผิดชอบ :</span>
                        <span className="text-gray-500">{selectedTicket.department}</span>
                      </div>
                    </div>
                    <p className="mt-6 text-[15px] text-gray-800 leading-relaxed font-medium">{selectedTicket.title}</p>
                    <div className="mt-8 flex gap-3">
                      <button onClick={() => setShowStatusModal(true)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors bg-white shadow-sm text-sm"><Edit className="w-4 h-4" /> ปรับสถานะ</button>
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors bg-white shadow-sm text-sm"><Info className="w-4 h-4" /> ปรับประเภทปัญหา</button>
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors bg-white shadow-sm text-sm"><PhoneCall className="w-4 h-4" /> คุยกับผู้แจ้ง</button>
                    </div>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <div className="relative w-[160px] h-[160px] rounded-2xl overflow-hidden shadow-sm group">
                      <img src={selectedTicket.image} alt="Before" className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white text-xs text-center py-1.5 font-medium">ก่อนแจ้ง</div>
                    </div>
                    <div className="relative w-[160px] h-[160px] rounded-2xl overflow-hidden shadow-sm bg-[#ffe082] flex flex-col items-center justify-between p-2">
                      <div className="text-black text-xs font-bold mt-1 bg-white/50 px-2 py-0.5 rounded-full">เจ้าหน้าที่กำลังแก้ไขปัญหา</div>
                      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-700"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
                      <div className="w-full bg-black text-white text-xs text-center py-1.5 font-medium rounded-b-xl absolute bottom-0 left-0">แก้ไขเสร็จสิ้น</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[400px]">
                  <h2 className="text-xl font-bold text-gray-900 mb-8">ไทม์ไลน์จัดการปัญหา</h2>
                  <div className="relative border-l-2 border-gray-100 ml-[120px]">
                    <div className="mb-10 relative">
                      <div className="absolute -left-[144px] w-[110px] text-right">
                        <div className="text-[#5a6cf3] font-bold">รับเรื่องแล้ว</div>
                        <div className="text-gray-500 text-sm mt-1">11 ก.ค. 69<br/>19:07น.</div>
                      </div>
                      <div className="absolute w-3 h-3 bg-[#5a6cf3] rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                      <div className="pl-6">
                        <div className="inline-flex bg-gray-100 px-4 py-1.5 rounded-full text-sm font-medium text-gray-800 mb-3">EMP ธนภัทร บุญล้ำ (BAS)</div>
                        <p className="text-gray-600">ครับ</p>
                      </div>
                    </div>
                    <div className="relative">
                       <div className="absolute -left-[144px] w-[110px] text-right">
                        <div className="text-black font-bold">รอรับเรื่อง</div>
                        <div className="text-gray-500 text-sm mt-1">11 ก.ค. 69<br/>19:06น.</div>
                      </div>
                      <div className="absolute w-3 h-3 bg-red-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                      <div className="pl-6">
                        <div className="inline-flex bg-gray-100 px-4 py-1.5 rounded-full text-sm font-medium text-gray-800 mb-3">ผู้แจ้ง</div>
                        <p className="text-gray-600 mb-4 leading-relaxed max-w-2xl">{selectedTicket.title}</p>
                        <div className="w-[200px] h-[150px] rounded-xl overflow-hidden">
                           <img src={selectedTicket.image} alt="Incident" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
             </div>
          )}
        </div>
      </main>
      
      {showAddEqModal && renderAddEquipmentModal()}
      {showStatusModal && renderStatusModal()}
      {showPMStatusModal && renderPMStatusModal()}
    </div>
  );
}