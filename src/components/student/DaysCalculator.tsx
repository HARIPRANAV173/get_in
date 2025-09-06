import React, { useState } from 'react';
import { Calculator, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAttendance } from '../../contexts/AttendanceContext';
import { useAuth } from '../../contexts/AuthContext';

const DaysCalculator: React.FC = () => {
  const { user } = useAuth();
  const { getStudentAttendance } = useAttendance();
  const [targetPercentage, setTargetPercentage] = useState(75);
  
  const studentRecords = getStudentAttendance(user?.id || 'STU001');
  const totalClasses = studentRecords.length;
  const presentClasses = studentRecords.filter(r => r.status === 'present' || r.status === 'late').length;
  const currentPercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

  // Calculate required classes to reach target percentage
  const calculateRequiredClasses = () => {
    if (currentPercentage >= targetPercentage) {
      return 0;
    }
    
    // Formula: (presentClasses + x) / (totalClasses + x) = targetPercentage / 100
    // Solving for x: x = (targetPercentage * totalClasses - 100 * presentClasses) / (100 - targetPercentage)
    const required = Math.ceil(
      (targetPercentage * totalClasses - 100 * presentClasses) / (100 - targetPercentage)
    );
    
    return Math.max(0, required);
  };

  // Calculate how many classes can be missed while maintaining target
  const calculateMissableClasses = () => {
    if (currentPercentage < targetPercentage) {
      return 0;
    }
    
    // Formula: (presentClasses) / (totalClasses + x) = targetPercentage / 100
    // Solving for x: x = (100 * presentClasses) / targetPercentage - totalClasses
    const missable = Math.floor(
      (100 * presentClasses) / targetPercentage - totalClasses
    );
    
    return Math.max(0, missable);
  };

  const requiredClasses = calculateRequiredClasses();
  const missableClasses = calculateMissableClasses();

  // Calculate days until semester end (assuming 120 total working days)
  const totalSemesterDays = 120;
  const remainingDays = totalSemesterDays - totalClasses;

  return (
    <div className="space-y-6">
      {/* Calculator Input */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center mb-6">
          <Calculator className="h-6 w-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Attendance Calculator</h3>
        </div>

        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Attendance Percentage
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="50"
              max="100"
              value={targetPercentage}
              onChange={(e) => setTargetPercentage(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-medium min-w-[60px] text-center">
              {targetPercentage}%
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Current Attendance</p>
              <p className="text-2xl font-bold text-gray-900">{currentPercentage.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Target</p>
              <p className="text-2xl font-bold text-gray-900">{targetPercentage}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calculator className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Classes Attended</p>
              <p className="text-2xl font-bold text-gray-900">{presentClasses}/{totalClasses}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calculation Results */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* If below target */}
        {currentPercentage < targetPercentage && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
              <div className="ml-4">
                <h4 className="text-lg font-medium text-red-900">Action Required</h4>
                <p className="text-red-700 mt-2">
                  You need to attend <strong>{requiredClasses} more consecutive classes</strong> to reach {targetPercentage}% attendance.
                </p>
                <div className="mt-4 space-y-2">
                  <div className="text-sm text-red-600">
                    • Current: {presentClasses} out of {totalClasses} classes
                  </div>
                  <div className="text-sm text-red-600">
                    • Required: {presentClasses + requiredClasses} out of {totalClasses + requiredClasses} classes
                  </div>
                  <div className="text-sm text-red-600">
                    • Days remaining in semester: {remainingDays}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* If above target */}
        {currentPercentage >= targetPercentage && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-start">
              <Target className="h-6 w-6 text-green-600 mt-1" />
              <div className="ml-4">
                <h4 className="text-lg font-medium text-green-900">Great Job!</h4>
                <p className="text-green-700 mt-2">
                  You can miss up to <strong>{missableClasses} more classes</strong> and still maintain {targetPercentage}% attendance.
                </p>
                <div className="mt-4 space-y-2">
                  <div className="text-sm text-green-600">
                    • Current: {presentClasses} out of {totalClasses} classes
                  </div>
                  <div className="text-sm text-green-600">
                    • You can miss: {missableClasses} classes maximum
                  </div>
                  <div className="text-sm text-green-600">
                    • Days remaining in semester: {remainingDays}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Visual Progress */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Progress Visualization</h4>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Current Progress</span>
                <span>{currentPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    currentPercentage >= targetPercentage ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(currentPercentage, 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Target Line</span>
                <span>{targetPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${targetPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">Quick Stats</h5>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Present:</span>
                <span className="font-medium ml-2">{presentClasses}</span>
              </div>
              <div>
                <span className="text-gray-600">Absent:</span>
                <span className="font-medium ml-2">{totalClasses - presentClasses}</span>
              </div>
              <div>
                <span className="text-gray-600">Total:</span>
                <span className="font-medium ml-2">{totalClasses}</span>
              </div>
              <div>
                <span className="text-gray-600">Remaining:</span>
                <span className="font-medium ml-2">{remainingDays}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scenarios */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Different Scenarios</h4>
        <div className="grid md:grid-cols-3 gap-4">
          {[70, 75, 80, 85, 90, 95].map((percentage) => {
            const required = Math.ceil(
              Math.max(0, (percentage * totalClasses - 100 * presentClasses) / (100 - percentage))
            );
            const missable = Math.floor(
              Math.max(0, (100 * presentClasses) / percentage - totalClasses)
            );

            return (
              <div key={percentage} className={`p-4 rounded-lg border ${
                percentage === targetPercentage ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{percentage}%</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {currentPercentage < percentage ? (
                      <>Need {required} classes</>
                    ) : (
                      <>Can miss {missable} classes</>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DaysCalculator;