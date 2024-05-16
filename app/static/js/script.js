const colors = [
    'cadetblue',
    'darkgoldenrod',
    'cornflowerblue',
    'darkkhaki',
    'hotpink',
    'gold'
]

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    
    return colors[randomIndex];
}