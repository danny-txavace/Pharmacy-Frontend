import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

export function formatCurrencySymbol(value: number | string | undefined | null): string
{
  if (value === null || value === undefined || value === '') return '';

  let numberValue: number;
  if (typeof value === 'string') {
    const cleanedValue = value.replace(/\./g, '').replace(',', '.');
    numberValue = parseFloat(cleanedValue);
  } else {
    numberValue = value;
  }

  if (isNaN(numberValue)) return '';

  const formattedNumber = numberValue
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return `${formattedNumber} MT`;
}

export function formatValue(format: string, value: number | string | undefined | null): string {
  if (value === null || value === undefined || value === '') return '';

  let numberValue: number;

  if (typeof value === 'string') {
    const cleanedValue = value.replace(/\./g, '').replace(',', '.');
    numberValue = parseFloat(cleanedValue);
  } else {
    numberValue = value;
  }

  if (isNaN(numberValue)) return '';

  if (format === 'percent')
  {
    return numberValue.toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')+' %';
  }
  else
  {
    return numberValue.toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

}

export function formatQty(value: number | string | undefined | null): string {
  if (value === null || value === undefined || value === '') return '';

    let numberValue: number;

    if (typeof value === 'string') {
      const cleanedValue = value.replace(/\./g, '').replace(',', '.');
      numberValue = parseFloat(cleanedValue);
    } else {
      numberValue = value;
    }

    if (isNaN(numberValue)) return '';

    return numberValue.toFixed(0)
      .replace('.', ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function formatDateLocale(
  value: string | Date | null | undefined,
  lang: string
): string {
  if (!value) return '';

  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return '';

  const months = {
    en: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    pt: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
  };

  const weekdays = {
    en: [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday',
      'Thursday', 'Friday', 'Saturday'
    ],
    pt: [
      'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
      'Quinta-feira', 'Sexta-feira', 'Sábado'
    ]
  };

  const day = date.getDate();           // 1-31
  const monthIndex = date.getMonth();   // 0-11
  const year = date.getFullYear();
  const weekdayIndex = date.getDay();   // 0-6 (Sun-Sat)

  if (lang === 'pt') {
    return `${weekdays.pt[weekdayIndex]}, ${day} de ${months.pt[monthIndex]} de ${year}`;
  } else {
    return `${weekdays.en[weekdayIndex]}, ${day} ${months.en[monthIndex]} ${year}`;
  }
}

export function formatTimeLocal(value: string | Date | undefined | null): string {
  if (!value) return '';

  const date = typeof value === 'string' ? new Date(value) : value;
  if (isNaN(date.getTime())) return '';

  let options: Intl.DateTimeFormatOptions = {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false
  };

  const locale = 'pt-MZ';
  options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };

  return date.toLocaleString(locale, options);
}

export function formatChartDateToMonth(
  value: string | Date | null | undefined,
  lang: string
): string {
  if (!value) return '';

  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return '';

  const months = {
    en: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    pt: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
  };

  const monthIndex = date.getMonth();   // 0-11
  const year = date.getFullYear();

  if (lang === 'pt') {
    return `${months.pt[monthIndex]} / ${year}`;
  } else {
    return `${months.en[monthIndex]} ${year}`;
  }
}

export function formatDateNoTime(value: string | number | Date | undefined | null): string {
  if (!value || value == null) return '';

  const date = new Date(value);
  if (isNaN(date.getTime())) return '';

  const locale = 'pt-MZ';
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit', month: '2-digit', year: 'numeric',
  };

  return date.toLocaleString(locale, options);
}

export function formatDateWithTime(value: string | Date | undefined | null): string {
  if (!value) return '';

  const date = typeof value === 'string' ? new Date(value) : value;
  if (isNaN(date.getTime())) return '';

  const locale = 'pt-MZ';
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false
  };

  return date.toLocaleString(locale, options);
}

export function nonEmptyTrim(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (typeof value === 'string' && value.trim() === '') {
      return { required: true }; // retorna erro de required
    }
    return null;
  };
}

export function capitalizeWords(value: string): string
{
  return value ?
    value
    .toLowerCase()
    .split(' ')
    .map(word =>
      word.length > 0
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : ''
    )
    .join(' ') : '';
}

export function chartTranslate(
  value: string | undefined,
  lang: string
): string {
  let num = 0;

  if (value === 'expected')
  { num = 0 }
  else if (value === 'received')
  { num = 1 }
  else if (value === 'fee')
  { num = 2 }

  const datas = {
    en: [
      'Expected', 'Received', '10% Fee'
    ],
    pt: [
      'Previsto', 'Recebido', 'Taxa 10%'
    ]
  };

  if (lang === 'pt') {
    return `${datas.pt[num]}`;
  } else {
    return `${datas.en[num]}`;
  }
}
