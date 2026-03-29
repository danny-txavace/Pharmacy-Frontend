export class NotificationMessages {

  static readonly Admin = class {

    static readonly AcademicStudentsList = class {
      static readonly View = 'academic-students-list-view';
      static readonly Created = 'ACADEMIC_STUDENTS-CREATED';
      static readonly Updated = 'ACADEMIC_STUDENTS-UPDATED';
    }

    static readonly AcademicStudentsAssessments = class {
      static readonly View = 'academic-students-assessments-view';
      static readonly Created = 'ACADEMIC_STUDENTS_ASSESSMENTS-CREATED';
      static readonly Updated = 'ACADEMIC_STUDENTS_ASSESSMENTS-UPDATED';
    }

    static readonly AcademicStudentsSelectList = class {
      static readonly View = 'academic-students-select-view';
      static readonly Created = 'ACADEMIC_STUDENTS_SELECT-CREATED';
      static readonly Updated = 'ACADEMIC_STUDENTS_SELECT-UPDATED';
    }

    static readonly FinancialPaymentSuccess = class {
      static readonly View = 'financial-payments-success-view';
    }

    static readonly FinancialPayments = class {
      static readonly View = 'financial-payments-view';
      static readonly Created = 'FINANCIAL_PAYMENT-CREATED';
    }

    static readonly FinancialAccountsPayable = class {
      static readonly View = 'financial-accounts-payable-view';
      static readonly Created = 'FINANCIAL_ACCOUNTS_PAYABLE-CREATED';
      static readonly Updated = 'FINANCIAL_ACCOUNTS_PAYABLE-UPDATED';
    }

    static readonly FinancialAccountsReceivable = class {
      static readonly View = 'financial-accounts-receivable-view';
      static readonly Created = 'FINANCIAL_ACCOUNTS_RECEIVABLE-CREATED';
      static readonly Updated = 'FINANCIAL_ACCOUNTS_RECEIVABLE-UPDATED';
    }

    static readonly FinancialAccountsBalance = class {
      static readonly View = 'financial-accounts-balance-view';
      static readonly Created = 'FINANCIAL_ACCOUNTS_BALANCE-CREATED';
      static readonly Updated = 'FINANCIAL_ACCOUNTS_BALANCE-UPDATED';
    }

    static readonly HumanResources = class {
      static readonly View = 'human-resources-view';
      static readonly Created = 'HUMAN_RESOURCES-CREATED';
      static readonly Updated = 'HUMAN_RESOURCES-UPDATED';
      static readonly Deleted = 'HUMAN_RESOURCES-DELETED';
    }

    static readonly SettingsFlyer = class {
      static readonly View = 'settings-flyer-view';
      static readonly Created = 'SETTINGS_FLYER-CREATED';
      static readonly Updated = 'SETTINGS_FLYER-UPDATED';
    }

    static readonly SettingsVlogs = class {
      static readonly View = 'settings-vlog-view';
      static readonly Created = 'SETTINGS_VLOG-CREATED';
      static readonly Updated = 'SETTINGS_VLOG-UPDATED';
    }

    static readonly Dashboard = class {
      static readonly View = 'dashboard-view';
      static readonly Updated = 'DASHBOARD-UPDATED';
    }

  };

}
