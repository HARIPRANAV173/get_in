import React, { useState } from 'react';
import { Search, Filter, Download, User, Mail, Phone } from 'lucide-react';

const StudentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  // Mock student data
  const students = [
    {
      id: 'STU001',
      name: 'Vennila Devi P',
      rollNumber: 'CS21001',
      email: 'vennila.devi@college.edu',
      phone: '+91 9876543210',
      department: 'Computer Science',
      semester: '6th',
      attendance: 85,
      totalClasses: 120,
      presentClasses: 102,
      lastSeen: '2024-01-15 10:30 AM',
    },
    {
      id: 'STU002',
      name: 'Jayashree R',
      rollNumber: 'CS21002',
      email: 'jayashree.r@college.edu',
      phone: '+91 9876543211',
      department: 'Computer Science',
      semester: '6th',
      attendance: 92,
      totalClasses: 120,
      presentClasses: 110,
      lastSeen: '2024-01-15 11:15 AM',
    },
    {
      id: 'STU003',
      name: 'Krisha Sri V V',
      rollNumber: 'CS21003',
      email: 'krisha.sri@college.edu',
      phone: '+91 9876543212',
      department: 'Computer Science',
      semester: '6th',
      attendance: 67,
      totalClasses: 120,
      presentClasses: 80,
      lastSeen: '2024-01-14 2:45 PM',
    },
    {
      id: 'STU004',
      name: 'Kanishka J',
      rollNumber: 'CS21004',
      email: 'kanishka.j@college.edu',
      phone: '+91 9876543213',
      department: 'Computer Science',
      semester: '6th',
      attendance: 78,
      totalClasses: 120,
      presentClasses: 94,
      lastSeen: '2024-01-15 9:30 AM',
    },
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || student.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const selectedStudentData = students.find(s => s.id === selectedStudent);

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
              </select>
            </div>

            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Students List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900">
                Students ({filteredStudents.length})
              </h4>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudent(student.id)}
                  className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedStudent === student.id ? 'bg-blue-50 border-r-4 border-blue-600' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <h5 className="font-medium text-gray-900">{student.name}</h5>
                        <p className="text-sm text-gray-600">{student.rollNumber}</p>
                        <p className="text-xs text-gray-500">{student.department}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        student.attendance >= 75 ? 'bg-green-100 text-green-800' :
                        student.attendance >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {student.attendance}%
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {student.presentClasses}/{student.totalClasses}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Student Details */}
        <div className="lg:col-span-1">
          {selectedStudentData ? (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-center mb-6">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-gray-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">{selectedStudentData.name}</h4>
                <p className="text-gray-600">{selectedStudentData.rollNumber}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedStudentData.email}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{selectedStudentData.phone}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h5 className="font-medium text-gray-900 mb-3">Attendance Summary</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Overall Attendance</span>
                      <span className="font-medium">{selectedStudentData.attendance}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Classes Attended</span>
                      <span className="font-medium">{selectedStudentData.presentClasses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Classes</span>
                      <span className="font-medium">{selectedStudentData.totalClasses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Seen</span>
                      <span className="font-medium text-xs">{selectedStudentData.lastSeen}</span>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      selectedStudentData.attendance >= 75 ? 'bg-green-500' :
                      selectedStudentData.attendance >= 60 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${selectedStudentData.attendance}%` }}
                  ></div>
                </div>

                <div className="pt-4 space-y-2">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    View Detailed Report
                  </button>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    Send Notification
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-center text-gray-500">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a student to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;