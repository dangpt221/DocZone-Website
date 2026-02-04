
import React, { useState, useEffect } from 'react';
import { db } from '../../services/db';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { analyzeAuditLogs } from '../../geminiService';
import { AuditLog } from '../../types';

export const AccessLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    setLogs(db.getAuditLogs());
  }, []);

  const handleAIAnalyze = async () => {
    setAnalyzing(true);
    const result = await analyzeAuditLogs(logs);
    setAnalysis(result);
    setAnalyzing(false);
  };

  const columns = [
    { 
      header: 'Thời gian', 
      headerEn: 'Timestamp', 
      key: 'timestamp',
      render: (log: AuditLog) => new Date(log.timestamp).toLocaleString()
    },
    { header: 'Người dùng', headerEn: 'Identity', key: 'userName' },
    { 
      header: 'Hành động', 
      headerEn: 'Operation', 
      key: 'action',
      render: (log: AuditLog) => (
        <span className={`font-black text-[10px] uppercase tracking-widest ${log.status === 'SUCCESS' ? 'text-emerald-500' : 'text-red-500'}`}>
          {log.action}
        </span>
      )
    },
    { header: 'Tài liệu', headerEn: 'Resource', key: 'documentTitle' },
    { header: 'Địa chỉ IP', headerEn: 'Network Origin', key: 'ip' },
  ];

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Audit Trails</h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest font-black">Nhật ký truy cập và Bảo mật hệ thống</p>
        </div>
        <Button onClick={handleAIAnalyze} loading={analyzing} variant="ghost">
          ✨ AI SECURITY INSIGHTS
        </Button>
      </header>

      {analysis && (
        <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white shadow-2xl animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🤖</span>
            <h3 className="font-black uppercase tracking-widest text-xs text-blue-100">AI Threat Analysis Result</h3>
          </div>
          <p className="text-lg leading-relaxed font-medium">{analysis}</p>
          <button onClick={() => setAnalysis(null)} className="mt-6 text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">Dismiss Analysis</button>
        </div>
      )}

      <Table columns={columns} data={logs} />
    </div>
  );
};
