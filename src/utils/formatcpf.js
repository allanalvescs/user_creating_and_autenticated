function maskCPF(value) {
    if (String(value).length === 11) {
        const valueCPF = String(value).split('')

        const format = valueCPF.map((currentValue, index) => {
            if (index === 2 || index === 5) {
                return `${currentValue}.`
            }

            if (index === 8) {
                return `${currentValue}-`
            }

            return currentValue
        })

        return format.join('')
    }
}

module.exports = maskCPF