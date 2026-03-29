import { HttpErrorResponse } from "@angular/common/http";
import { environment } from "../lib/environments/environment";

export function getSuccessMessage(format: string): string
{
  const desc = 'MESSAGE_TOAST.SUCCESS.DETAIL';
  let msg = '';

  switch (format)
  {
    case 'admin-student_created' :
      msg = `${desc}.STUDENTS.CREATED`;
      break;
    case 'admin-student_updated' :
      msg = `${desc}.STUDENTS.UPDATED`;
      break;
    case 'admin-student_assessment_updated':
      msg = `${desc}.STUDENT_ASSESSMENT.UPDATED`;
      break;
    case 'admin-student_apply_progression':
      msg = `${desc}.STUDENT_ASSESSMENT.APPLY_PROGRESSION`;
      break;
    case 'admin-acc_payable_created' :
      msg = `${desc}.FINANCIAL.ACC_CREATED`;
      break;
    case 'admin-financial_acc_cancelled':
      msg = `${desc}.FINANCIAL.ACC_ON_CANCEL`;
      break;
    case 'admin-financial_acc_payable_confirm':
      msg = `${desc}.FINANCIAL.ACC_CONFIRM_PAYABLE`;
      break;
    case 'admin-financial_acc_balance_tranfer':
      msg = `${desc}.FINANCIAL.ACC_BALANCE_TRANSFER_SUCCESS`;
      break;
    case 'admin-employee_created' :
      msg = `${desc}.HUMMAN_RESOURCES.CREATED`;
      break;
    case 'admin-employee_updated' :
      msg = `${desc}.HUMMAN_RESOURCES.UPDATED`;
      break;
    case 'admin-employee_deleted' :
      msg = `${desc}.HUMMAN_RESOURCES.DELETED`;
      break;
    case 'admin-settings_flyer_created' :
      msg = `${desc}.SETTINGS.FLYER.CREATED`;
      break;
    case 'admin-settings_vlog_created' :
      msg = `${desc}.SETTINGS.VLOG.CREATED`;
      break;
    case 'admin-settings_vlog_updated' :
      msg = `${desc}.SETTINGS.VLOG.UPDATED`;
      break;
    case 'admin-settings_vlog_deleted' :
      msg = `${desc}.SETTINGS.VLOG.DELETED`;
      break;
    default :
      msg = `${desc}.DEFAULT`;
      break;
  }

  return msg;
}

export function getErrorMessage(format: string): string
{
  const desc = 'MESSAGE_TOAST.ERROR.DETAIL.OTHERS';
  let msg = '';

  switch (format)
  {
    case 'admin-id_not_found' :
      msg = `${desc}.IDENTITY_NOT_RECOGNIZED`;
      break;
    case 'admin-financial_acc_balance' :
      msg = `${desc}.ORIGIN_DESTINATION_SAME`;
      break;
    default :
      msg = `${desc}.DEFAULT`;
      break;
  }

  return msg;
}

export function getServerErrorMessage(err: HttpErrorResponse): string
{
  const desc = 'MESSAGE_TOAST.ERROR.DETAIL.SERVER';
  // Mensagem padrão amigável
  let msg = `${desc}.UNEXPECTED`;

  // 1. Erros de requisição HTTP (os mais comuns)
  if (err?.status !== undefined) {
    switch (err.status) {
      case 0:
        msg = `${desc}.NO_CONNECTION`;
        break;

      case 400:
        // Erros de validação ou dados mal enviados
        msg = `${desc}.INVALID_DATA`;
        break;

      case 401:
        msg = `${desc}.SESSION_EXPIRED`;
        break;

      case 403:
        msg = `${desc}.NO_PERMISSION`;
        break;

      case 404:
        msg = `${desc}.NOT_FOUND`;
        break;

      case 408:
        msg = `${desc}.TIMEOUT`;
        break;

      case 409:
        msg = `${desc}.DUPLICATE`;
        break;

      case 422:
        msg = `${desc}.`;
        break;

      case 429:
        msg = `${desc}.TOO_MANY_ATTEMPTS`;
        break;

      case 500:
        msg = `${desc}.SERVER_PROBLEM`;
        break;

      case 502:
      case 503:
        msg = `${desc}.SERVER_UNAVAILABLE`;
        break;

      case 504:
        msg = `${desc}.SERVER_SLOW`;
        break;

      default:
        msg = `${desc}.OPERATION_CODE`;
        break;
    }

    // Caso tenha lista de erros (validações detalhadas)
    if (Array.isArray(err.error?.errors) && err.error.errors.length > 0) {
      const primeiroErro = err.error.errors[0];
      msg = primeiroErro.message || msg;
    }

    return msg;
  }

  // 2. Erros do servidor sem código HTTP (ex: timeout, erro manual)
  if (err?.error) {
    if (err.error.message) return err.error.message;

    if (Array.isArray(err.error.errors) && err.error.errors.length > 0) {
      const primeiroErro = err.error.errors[0];
      return primeiroErro.message || msg;
    }

    if (typeof err.error === 'string') {
      return `${desc}.SERVER`;
    }
  }

  // 3. Problemas de ligação ou timeout
  if (err?.message && err.message.includes('timeout')) {
    return `${desc}.OPERATION_TIMEOUT`;
  }

  if (err?.message && (err.message.includes('NetworkError') || err.message.includes('Failed to fetch'))) {
    return `${desc}.NO_INTERNET`;
  }

  // 4. Mensagem directa do erro (se for segura)
  if (err?.message && typeof err.message === 'string') {
    // Evita mensagens técnicas assustadoras para o utilizador
    if (err.message.includes('ExpressionChanged')) {
      return `${desc}.PAGE`;
    }
    // Em produção, preferimos não mostrar mensagens técnicas cruas
    if (environment?.production) {
      return msg;
    }
    return err.message;
  }

  // 5. Se o erro for uma string simples
  if (typeof err === 'string') {
    return err;
  }

  // 6. Último recurso
  return msg;
}
