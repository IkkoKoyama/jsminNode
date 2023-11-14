import './_';
declare global {
  interface JsminExtension {
    Time: Time
  }

  namespace Time {
    type Input = any
    type ElementableValue = any

    interface Time {
      new( defaultValue: string | number ): Method
    }

    type DateTrimTypes = 'Y' | 'M' | 'W' | 'D' | 'H' | 'I' | 'S'

    interface Method {
      value: Date

      Time: Time.Time

      validate: boolean
      time: number
      weekday: number
      weekInMonth: number
      weekInYear: number
      isLastWeekInMonth: boolean
      year: number
      month: number
      date: number
      hours: number
      minutes: number
      seconds: number

      isSameYear( v: any ): boolean
      isSameMonth( v: any ): boolean
      isSameWeek( v: any ): boolean
      isSameDate( v: any ): boolean

      setYear( v: number ): Time.Method
      setMonth( v: number ): Time.Method
      setDate( v: number ): Time.Method
      setHours( v: number ): Time.Method
      setMinutes( v: number ): Time.Method
      setSeconds( v: number ): Time.Method
      setMilliseconds( v: number ): Time.Method

      setMidnight(): Time.Method

      addYear( v: number ): Time.Method
      addMonth( v: number ): Time.Method
      addWeek( v: number ): Time.Method
      addDate( v: number ): Time.Method
      addHours( v: number ): Time.Method
      addMinutes( v: number ): Time.Method
      addSeconds( v: number ): Time.Method

      toFormat( format: string ): string
      toFormatYMD( lang?: 'JP' ): string
      toFormatYM( lang?: 'JP' ): string
      toFormatMD( lang?: 'JP' ): string
      toFormatHM( lang?: 'JP' ): string
      toFormatYMDHM( lang?: 'JP' ): string
      toFormatYMDHMS( lang?: 'JP' ): string

      getFirstDayOfTheYear(): Time.Method
      getLastDayOfTheYear(): Time.Method
      getFirstDayOfTheMonth(): Time.Method
      getLastDayOfTheMonth(): Time.Method
      getFirstDayOfTheWeek(): Time.Method
      getLastDayOfTheWeek(): Time.Method

      diff( v: Time.Method ): {
        years: number
        months: number
        dates: number
        hours: number
        minutes: number
        seconds: number
      }
      getAge(): number
    }
  }
  interface Time {
    fn: Time.Method | plainObject
    prototype: Time.Method | plainObject
    ( v?: Time.Input ): Time.Method

    isTimeObject( v: any ): boolean
    getFromNumberYYYYMMDD( v: number ): Time.Method
    getAge( birthday: Time.Method,date?: Time.Method ): number
  }
}

{
  const D: Time = ( v?: Time.Input ) => {
    return new D.fn.Time( v );
  }
  D.fn = D.prototype = {}

  const SyncValues = function ( _this: Time.Method,date: Date ) {
    _this.value = date;

    let Valid = $.is.date( date );
    _this.validate = Valid;

    if ( !Valid ) {
      _this = {
        ..._this,
        time: -1,
        year: -1,
        month: -1,
        weekday: -1,
        weekInYear: -1,
        date: -1,
        hours: -1,
        minutes: -1,
        seconds: -1
      }
      return;
    }
    _this.time = date.getTime();

    _this.weekday = date.getDay();
    _this.year = date.getFullYear();
    _this.month = date.getMonth() + 1;
    _this.date = date.getDate();
    {
      let firstDayOfYear = new Date( _this.year,0,1 );
      let firstWeekDayOfFirstDayOfYear = new Date( firstDayOfYear.valueOf() );
      firstWeekDayOfFirstDayOfYear.setDate( firstWeekDayOfFirstDayOfYear.getDate() - ( firstDayOfYear.getDay() + 1 ) );
      let margin = date.getTime() - firstWeekDayOfFirstDayOfYear.getTime();
      let marginDay = Math.ceil( margin / ( 1000 * 60 * 60 * 24 ) );
      _this.weekInYear = Math.ceil( marginDay / 7 );
    }
    {
      let firstDayOfMonth = new Date( _this.year,_this.month - 1,1 );
      let firstWeekDayOfFirstDayOfMonth = new Date( firstDayOfMonth.valueOf() );
      firstWeekDayOfFirstDayOfMonth.setDate( firstWeekDayOfFirstDayOfMonth.getDate() - ( firstDayOfMonth.getDay() + 1 ) );
      let margin = date.getTime() - firstWeekDayOfFirstDayOfMonth.getTime();
      let marginDay = Math.ceil( margin / ( 1000 * 60 * 60 * 24 ) );
      let weeks = Math.ceil( marginDay / 7 );

      _this.weekInMonth = weeks;
    }
    {
      let lastDayOfMonth = new Date( _this.year,_this.month,0 );
      let lastDayWeekday = lastDayOfMonth.getDay();
      let lastWeekFirstDay = new Date( new Date( lastDayOfMonth ).setDate( lastDayOfMonth.getDate() - lastDayWeekday ) );

      _this.isLastWeekInMonth = _this.date >= lastWeekFirstDay.getDate();
    }
    _this.hours = date.getHours();
    _this.minutes = date.getMinutes();
    _this.seconds = date.getSeconds();

    return _this;
  }

  $.extend( {
    Time: function ( this: Time.Method,v: Time.Input ) {
      if ( D.isTimeObject( v ) ) {
        v = v.value;
      }
      if ( !v ) {
        if ( v === null ) v = void 0;
        else if ( v === void 0 ) v = new Date();
      }
      let Value = new Date( v );

      return SyncValues( this,Value );
    }
  },D );

  D.fn.Time.prototype = D.fn;
  D.fn.Time.prototype.constructor = D;
  D.isTimeObject = ( v ) => {
    return ( v || {} )?.constructor === D;
  }
  D.getFromNumberYYYYMMDD = ( v ) => {
    let Date = String( v ).replace( /(\d{4})(\d{2})(\d{2})/,'$1/$2/$3' );
    return $.Time( Date + ' 00:00' );
  }
  D.getAge = ( birthday,date ) => {
    let DATE = date || $.Time();
    let AGE = DATE.year - birthday.year;
    if ( birthday.month > DATE.month ) {
      AGE--;
    } else if ( birthday.month == DATE.month ) {
      if ( DATE.date < birthday.date ) {
        AGE--;
      }
    }
    return AGE;
  }
  $.Time = D as any;

  {
    $.extend( {
      setYear: function ( this: Time.Method,v: number ) {
        let newDate = new Date( this.value.valueOf() );
        newDate.setFullYear( v );
        return SyncValues( this,newDate );
      },
      setMonth: function ( this: Time.Method,v: number ) {
        let newDate = new Date( this.value.valueOf() );
        newDate.setMonth( v - 1 );
        return SyncValues( this,newDate );
      },
      setDate: function ( this: Time.Method,v: number ) {
        let newDate = new Date( this.value.valueOf() );
        newDate.setDate( v );
        return SyncValues( this,newDate );
      },
      setHours: function ( this: Time.Method,v: number ) {
        let newDate = new Date( this.value.valueOf() );
        newDate.setHours( v );
        return SyncValues( this,newDate );
      },
      setMinutes: function ( this: Time.Method,v: number ) {
        let newDate = new Date( this.value.valueOf() );
        newDate.setMinutes( v );
        return SyncValues( this,newDate );
      },
      setSeconds: function ( this: Time.Method,v: number ) {
        let newDate = new Date( this.value.valueOf() );
        newDate.setSeconds( v );
        return SyncValues( this,newDate );
      },
      setMilliseconds: function ( this: Time.Method,v: number ) {
        let newDate = new Date( this.value.valueOf() );
        newDate.setMilliseconds( v );
        return SyncValues( this,newDate );
      },

      setMidnight: function ( this: Time.Method ) {
        let newDate = new Date( this.value.valueOf() );
        newDate.setHours( 0 );
        newDate.setMinutes( 0 );
        newDate.setSeconds( 0 );
        newDate.setMilliseconds( 0 );
        return SyncValues( this,newDate );
      },

      addYear: function ( this: Time.Method,v: number ) {
        return this.setYear( this.year + v );
      },
      addMonth: function ( this: Time.Method,v: number ) {
        return this.setMonth( this.month + v );
      },
      addWeek: function ( this: Time.Method,v: number ) {
        return this.addDate( 7 * v );
      },
      addDate: function ( this: Time.Method,v: number ) {
        return this.setDate( this.date + v );
      },
      addHours: function ( this: Time.Method,v: number ) {
        return this.setHours( this.hours + v );
      },
      addMinutes: function ( this: Time.Method,v: number ) {
        return this.setMinutes( this.minutes + v );
      },
      addSeconds: function ( this: Time.Method,v: number ) {
        return this.setSeconds( this.seconds + v );
      },

      isSameYear: function ( v: any ) {
        let compareTime = $.Time( v );
        return this.year == compareTime.year;
      },
      isSameMonth: function ( v: any ) {
        let compareTime = $.Time( v );
        return this.year == compareTime.year && this.month == compareTime.month;
      },
      isSameWeek: function ( v: any ) {
        let compareTime = $.Time( v );
        return this.year == compareTime.year && this.weekInYear == compareTime.weekInYear;
      },
      isSameDate: function ( v: any ) {
        let compareTime = $.Time( v );
        return this.year == compareTime.year && this.month == compareTime.month && this.date == compareTime.date;
      },

      toFormat: function ( this: Time.Method,format: string ) {
        if ( !this.validate ) return '';
        return format
          .replace( /\%y/ig,this.year.zeroEmbed( 4 ) )
          .replace( /\%m/ig,this.month.zeroEmbed( 2 ) )
          .replace( /\%d/ig,this.date.zeroEmbed( 2 ) )
          .replace( /\%w/ig,this.weekInYear.zeroEmbed( 2 ) )
          .replace( /\%h/ig,this.hours.zeroEmbed( 2 ) )
          .replace( /\%i/ig,this.minutes.zeroEmbed( 2 ) )
          .replace( /\%s/ig,this.seconds.zeroEmbed( 2 ) );
        ;
      },
      toFormatYMD: function ( this: Time.Method,lang?: 'JP' ) {
        if ( !this.validate ) return '';
        if ( lang == 'JP' ) return this.toFormat( '%Y年%M月%D日' );
        return this.toFormat( '%Y/%M/%D' );
      },
      toFormatYM: function ( this: Time.Method,lang?: 'JP' ) {
        if ( !this.validate ) return '';
        if ( lang == 'JP' ) return this.toFormat( '%Y年%M月' );
        return this.toFormat( '%Y/%M' );
      },
      toFormatMD: function ( this: Time.Method,lang?: 'JP' ) {
        if ( !this.validate ) return '';
        if ( lang == 'JP' ) return this.toFormat( '%M月%D日' );
        return this.toFormat( '%M/%D' );
      },
      toFormatHM: function ( this: Time.Method,lang?: 'JP' ) {
        if ( !this.validate ) return '';
        if ( lang == 'JP' ) return this.toFormat( '%h時%m分' );
        return this.toFormat( '%h:%i' );
      },
      toFormatYMDHM: function ( this: Time.Method,lang?: 'JP' ) {
        if ( !this.validate ) return '';
        if ( lang == 'JP' ) return this.toFormat( '%Y年%M月%D日%h時%m分' );
        return this.toFormat( '%Y/%M/%D %h:%i' );
      },
      toFormatYMDHMS: function ( this: Time.Method,lang?: 'JP' ) {
        if ( !this.validate ) return '';
        if ( lang == 'JP' ) return this.toFormat( '%Y年%M月%D日%h時%m分%s秒' );
        return this.toFormat( '%Y/%M/%D %h:%i:%s' );
      },

      getFirstDayOfTheYear: function ( this: Time.Method ) {
        return $.Time( new Date( this.value.getFullYear(),0,1 ) );
      },
      getLastDayOfTheYear: function ( this: Time.Method ) {
        return $.Time( new Date( this.value.getFullYear() + 1,0,0 ) );
      },
      getFirstDayOfTheMonth: function ( this: Time.Method ) {
        return $.Time( new Date( this.value.getFullYear(),this.month - 1,1 ) );
      },
      getLastDayOfTheMonth: function ( this: Time.Method ) {
        return $.Time( new Date( this.value.getFullYear(),this.month,0 ) );
      },
      getFirstDayOfTheWeek: function ( this: Time.Method ) {
        let value = $.Time( this.value );
        return value.addDate( -value.weekday );
      },
      getLastDayOfTheWeek: function ( this: Time.Method ) {
        let value = $.Time( this.value );
        return value.addDate( 6 - value.weekday );
      },

      diff: function ( this: Time.Method,compareTime: Time.Method ) {
        let timeDiff = this.time - compareTime.time;
        return {
          years: this.year - compareTime.year,
          months: ( this.year - compareTime.year ) * 12 + ( this.month - compareTime.month ),
          dates: Math.floor( timeDiff / ( 60 * 60 * 24 * 1000 ) ),
          hours: Math.floor( timeDiff / ( 60 * 60 * 1000 ) ),
          minutes: Math.floor( timeDiff / ( 60 * 1000 ) ),
          seconds: Math.floor( timeDiff / 1000 ),
        }
      },
      getAge: function ( this: Time.Method ) {
        let today = $.Time();
        let years = today.year - this.year;

        if ( this.month > today.month || ( this.month == today.month && this.date > today.date ) ) years--;
        return years;
      },
    },D );
  }
}