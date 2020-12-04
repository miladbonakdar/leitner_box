const fs = require('fs')
const path = require('path')
const util = require('util')
const readdirAsync = util.promisify(fs.readdir)
const readFileAsync = util.promisify(fs.readFile)

module.exports = async (categoryInserter, cardInserter) => {
    const jsonFilesPath = path.resolve(__baseDirname, 'assets')
    const files = await readdirAsync(jsonFilesPath)
    const jsonFileNames = files.filter(f => f.endsWith('.json'))
    const promises = []
    for (const jsonFileName of jsonFileNames)
        promises.push(loadAndSaveCategory(path.resolve(jsonFilesPath, jsonFileName), jsonFileName,
            categoryInserter, cardInserter))
    return await Promise.all(promises)
}

async function loadAndSaveCategory(filePath, jsonFileName, categoryInserter, cardInserter) {
    const jsonString = await readFileAsync(filePath)
    const cards = JSON.parse(jsonString.toString())
    const lang = jsonFileName.split('.')[1]
    let categoryName = jsonFileName.split('.')[0].split('_').join(' ')
    const category = {
        language: lang,
        name: categoryName
    }
    category.id = await categoryInserter(category)

    const promises = []
    for (const card of cards)
        promises.push(loadAndSaveCard(card, category, cardInserter))
    await Promise.all(promises)
    return {
        id: category.id,
        name: categoryName,
        cardsCount: cards.length
    }
}

async function loadAndSaveCard(card, category, cardInserter) {
    card.category = category
    return  await cardInserter(card)
}