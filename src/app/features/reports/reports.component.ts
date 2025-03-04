import { Component, PLATFORM_ID, Inject, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MaterialModule } from '../../shared/Materials/material.module';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

declare global {
  interface Window {
    pdfMake: any;
  }
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [MaterialModule, FormsModule,CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})

export class ReportsComponent implements OnInit {
  fromDate!: Date;
  toDate!: Date;
  visits: any[] = [];
  isLoading = false;
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const today = new Date();
    this.toDate = today;
    this.fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
  }
  
  fetchVisitData() {
    this.isLoading = true;
    
    this.apiService.getRequest('visits/sheduleVisit').subscribe(
      (response: any) => {
        if (response.status && response.data) {
          this.visits = response.data
            .filter((visit: any) => {
              const visitDate = new Date(visit.schedule_date);
              return visitDate >= this.fromDate && visitDate <= this.toDate;
            })
            .map((visit: any) => ({
              sl_no: visit.sl_no,
              party_sl: visit.party_sl,
              scheduleDate: new Date(visit.schedule_date),
              actualVisitDate: visit.actual_visited_date ? new Date(visit.actual_visited_date) : null,
              visitType: visit.visit_type,
              scheduleType: visit.schedule_type,
              assignedFor: visit.assigned_for,
              nar: visit.nar,
              filePath: visit.file_path,
              remarks: visit.remarks || 'N/A'
            }));
        }
        this.isLoading = false;
        
        if (this.visits.length > 0) {
          this.generatePDF();
        } else {
          alert('No visit data found for the selected date range.');
        }
      },
      (error) => {
        console.error('Error fetching visits:', error);
        this.isLoading = false;
        alert('Failed to fetch visit data. Please try again.');
      }
    );
  }
  
  generateReport() {
    if (!this.fromDate || !this.toDate) {
      alert('Please select both dates!');
      return;
    }
    
    if (this.fromDate > this.toDate) {
      alert('From date cannot be after To date!');
      return;
    }
    
    this.fetchVisitData();
  }
  
  generatePDF() {
    if (!isPlatformBrowser(this.platformId)) {
      console.warn('PDF generation is only available in browser context');
      return;
    }
    
    if (!window.pdfMake) {
      alert('PDF generation library is not loaded. Please refresh the page or try again later.');
      return;
    }
    
    const tableBody = [
      [
        { text: 'Sl No', style: 'tableHeader', fillColor: '#3f51b5', color: 'white' }, 
        { text: 'Party', style: 'tableHeader', fillColor: '#3f51b5', color: 'white' },
        { text: 'Schedule Date', style: 'tableHeader', fillColor: '#3f51b5', color: 'white' },
        { text: 'Actual Visit Date', style: 'tableHeader', fillColor: '#3f51b5', color: 'white' },
        { text: 'Inspector', style: 'tableHeader', fillColor: '#3f51b5', color: 'white' },
        { text: 'Remarks', style: 'tableHeader', fillColor: '#3f51b5', color: 'white' }
      ]
    ];
    
    this.visits.forEach((visit, index) => {
      const rowData = [
        (index + 1).toString(),
        visit.party_sl.toString(),
        this.formatDate(visit.scheduleDate),
        visit.actualVisitDate ? this.formatDate(visit.actualVisitDate) : 'Not Visited',
        `Inspector ${visit.assignedFor}`, 
        visit.remarks
      ];
      
      tableBody.push(rowData);
    });
    
    const inspectorSummary = this.visits.reduce((acc: any, visit: any) => {
      const inspectorId = visit.assignedFor;
      if (!acc[inspectorId]) {
        acc[inspectorId] = { count: 0, completed: 0, pending: 0 };
      }
      acc[inspectorId].count++;
      if (visit.actualVisitDate) {
        acc[inspectorId].completed++;
      } else {
        acc[inspectorId].pending++;
      }
      return acc;
    }, {});
    
    const summaryTableBody = [
      [
        { text: 'Inspector', style: 'tableHeader', fillColor: '#3f51b5', color: 'white' },
        { text: 'Total Visits', style: 'tableHeader', fillColor: '#3f51b5', color: 'white' },
        { text: 'Completed', style: 'tableHeader', fillColor: '#3f51b5', color: 'white' },
        { text: 'Pending', style: 'tableHeader', fillColor: '#3f51b5', color: 'white' }
      ]
    ];
    
    Object.keys(inspectorSummary).forEach(inspectorId => {
      const data = inspectorSummary[inspectorId];
      summaryTableBody.push([
        `Inspector ${inspectorId}`,
        data.count.toString(),
        data.completed.toString(),
        data.pending.toString()
      ]);
    });
    
    const totalVisits = this.visits.length;
    const completedVisits = this.visits.filter(v => v.actualVisitDate).length;
    const pendingVisits = totalVisits - completedVisits;
    const completionRate = totalVisits > 0 ? Math.round((completedVisits / totalVisits) * 100) : 0;
    
    const documentDefinition = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [40, 60, 40, 60],
      header: {
        text: 'Visit Reports',
        style: 'header',
        margin: [40, 20, 0, 0]
      },
      footer: function(currentPage: number, pageCount: number) { 
        return {
          text: `Page ${currentPage} of ${pageCount}`,
          alignment: 'center',
          margin: [0, 10, 0, 0]
        };
      },
      content: [
        {
          columns: [
            {
              width: '*',
              text: [
                { text: 'Visit Summary Report\n', style: 'title' },
                { text: `Generated on: ${new Date().toLocaleString()}`, style: 'small' }
              ]
            },
            {
              width: 'auto',
              stack: [
                { text: 'Date Range:', style: 'label' },
                { text: `${this.formatDate(this.fromDate)} - ${this.formatDate(this.toDate)}`, style: 'value' }
              ],
              alignment: 'right'
            }
          ]
        },
        
        {
          style: 'section',
          stack: [
            { text: 'Overview', style: 'sectionHeader' },
            {
              columns: [
                {
                  width: 'auto',
                  stack: [
                    { text: 'Total Visits:', style: 'label' },
                    { text: 'Completed Visits:', style: 'label' },
                    { text: 'Pending Visits:', style: 'label' },
                    { text: 'Completion Rate:', style: 'label' }
                  ]
                },
                {
                  width: '*',
                  stack: [
                    { text: totalVisits.toString(), style: 'value' },
                    { text: completedVisits.toString(), style: 'value' },
                    { text: pendingVisits.toString(), style: 'value' },
                    { text: `${completionRate}%`, style: 'value' }
                  ],
                  margin: [10, 0, 0, 0]
                }
              ]
            }
          ]
        },
        
        {
          style: 'section',
          stack: [
            { text: 'Inspector Summary', style: 'sectionHeader' },
            {
              table: {
                headerRows: 1,
                widths: ['*', 'auto', 'auto', 'auto'],
                body: summaryTableBody
              },
              layout: {
                fillColor: function(i: number) {
                  return i % 2 === 0 ? '#f8f9fa' : null;
                }
              }
            }
          ]
        },
        
        {
          style: 'section',
          stack: [
            { text: 'Visit Details', style: 'sectionHeader' },
            {
              table: {
                headerRows: 1,
                widths: ['auto', 'auto', 'auto', 'auto', 'auto', '*'],
                body: tableBody
              },
              layout: {
                fillColor: function(i: number) {
                  return i % 2 === 0 ? '#f8f9fa' : null;
                }
              }
            }
          ]
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          color: '#3f51b5'
        },
        title: {
          fontSize: 20,
          bold: true,
          margin: [0, 0, 0, 5]
        },
        sectionHeader: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 10],
          color: '#3f51b5'
        },
        section: {
          margin: [0, 20, 0, 10]
        },
        tableHeader: {
          bold: true,
          fontSize: 11
        },
        label: {
          bold: true,
          fontSize: 11,
          margin: [0, 5, 0, 0]
        },
        value: {
          fontSize: 11,
          margin: [0, 5, 0, 0]
        },
        small: {
          fontSize: 10,
          italics: true,
          color: '#666666'
        }
      }
    };
    
    window.pdfMake.createPdf(documentDefinition).open();
  }
  
  formatDate(date: Date): string {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}