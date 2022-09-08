import countries from './countries.json'

const $ = selector => document.querySelector(selector)

function changeTimeZone (date, timeZone){
    const dateToUse = typeof date === 'string'
    ? new Date(date)
    : date


    return new Date(dateToUse.toLocaleString('en-US', {
        timeZone
    }))    
}

const tranformDateToString = (date) => {
    const localDate = date.toLocaleString('es-ES', {
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
        })
    
        return localDate.replace(':00', 'H')
}


const $input = $('input')
const $textarea = $('textarea')

$input.addEventListener('change', ()=>{
    const date = $input.value

    const mainDate = new Date(date)

    const times = {}

    countries.forEach(country => {
        const { country_code: code, emoji, timezones } = country
        const [timezone] = timezones

        const dateInTimezone = changeTimeZone(mainDate, timezone)
        const hour = dateInTimezone.getHours()

        times[hour] ??= []

        times[hour].push({
            date: dateInTimezone,
            code,
            emoji,
            timezones
        })
    })

    const sortedTimesEntries = Object
    .entries(times)
    .sort(([timeA], [timeB]) => timeB - +timeA)

   const html = sortedTimesEntries.map(([, countries]) =>{
    const flags = countries.map(country => `${country.emoji}`).join(' ')
        const [country] = countries
        const { date } = country

        return `${tranformDateToString(date)} ${flags}`
    }).join('\n')

    navigator.clipboard.writeText(html)

    $textarea.value = html
})