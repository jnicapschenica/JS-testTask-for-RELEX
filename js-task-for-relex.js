const readline = require('readline-sync')           //организация консольного ввода

//объекты, характеризующие игрока и ИИ
const YOU = {
    card: -1,                                       //переменная отвечает за выкладываемую на стол карту
    count: 0,                                       //счет штрафных очков
    deck: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],   //играющая колода на руках
    played: [],                                     //выложенные на предыдущих ходях карты
    didWin: false                                   //выиграл или нет игрок прошлый раунд
}
const AI = {
    card: -1,
    count: 0,
    deck: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    played: [],
}

//вспомогательные переменные
let n = 0, m = 4                                    //n - атака ИИ, m - защита
// экспериментальным путем установлено, что при данной тактике лучше всего начинать защиту именно с 4
// таким образом на конец игры у ИИ в активно колоде остаются самые сильные карты
let index = -1
let canPlay = true                                  // переменная, помогающая установить, верно ли игрок вводит свою карту
let str = ''                                        // помощь для вывода активной колоды

console.log('Добро пожаловать в игру "Дуэль"!')
console.log(`Правила простые: 
В эту игру играют два игрока, у каждого из которых на руках 12 карточек с числами от 0 до 11. 
Первый игрок выбирает карту из имеющихся у него на руках и выкладывает на стол рубашкой вверх. Число на выбранной карте будет являться "атакой" игрока. 
После этого второй игрок выбирает карту из оставшихся у него на руках и также выкладывает её рубашкой вверх. Это его "защита". 
После этого игроки одновременно переворачивают карты, и защищающийся игрок получает столько штрафных очков насколько "атака" первого игрока превышает "защиту" второго. 
В следующем раунде игроки меняются местами.
Игра заканчивается, когда у игроков не остаётся карт на руках. Выигрывает игрок, получивший меньше всего штрафных очков.`)
console.log('\nВыберите, кто начнет игру. Чтобы начали Вы, введите YOU, чтобы начал компьютер, введите AI')
const choice = readline.question('\t>')
switch (choice) {
    case 'YOU':
        for (let i = 0; i < 12; i++) {                              //12 раундов
            str = ''
            console.log('\nУ Вас на руках карты:')
            for (let j = 0; j < YOU.deck.length; j++) {
                str += YOU.deck[j] + ' '
            }
            console.log(str)                                        //вывод активной колоды пользователя в начале каждого раунда

            if (i % 2 === 0) {                                      //в случае, когда игрок начинает, каждая его атака приходится на четное значение счетчика i
                YOU.didWin = false

                console.log('\nВыберите карту "атаки"')
                do {
                    canPlay = true                                  //предполагаем, что введенная карта может быть выложена на стол

                    YOU.card = readline.question('\t>')
                    YOU.card=parseInt(YOU.card)

                    if (isNaN(YOU.card)) {
                        console.log('Ваша карта должна быть числом! Повторите ввод')
                        canPlay = false
                    } else if (YOU.card > 11) {
                        console.log('Ваша карта не может быть больше 11! Повторите ввод')
                        canPlay = false
                    } else if (YOU.card < 0) {
                        console.log('Ваша карта не может быть отрицательным числом! Повторите ввод')
                        canPlay = false
                    } else {
                        for (let j = 0; j < YOU.played.length; j++) {
                            if (YOU.played[j] === YOU.card) {
                                console.log('Вы уже сыграли этой картой! Повторите ввод')
                                canPlay = false
                                break
                            }
                        }
                    }
                } while (!canPlay) //если какое-либо условие нарушено, пользователь вводит карту заново, до тех пор, пока карта не будет удовлетворять всем условиям

                YOU.played.push(YOU.card)                       //добавление разыгранной карты в "отбой"

                index = YOU.deck.indexOf(YOU.card)
                if (index > -1) {
                    YOU.deck.splice(index, 1)         //удаление разыгранной карты из активной колоды
                }

                AI.card = m++                                   //в каждом раунде выкладывается следующая по старшинству карта
                for (let j = 0; j < AI.played.length; j++) {    //если карта уже была выложена однажды, берется следующая
                    if (AI.card === AI.played[j]) {
                        if (AI.card >= 11) {
                            AI.card = 0
                            j = 0
                        } else {
                            AI.card++
                            j = 0
                        }
                    }
                }

                AI.played.push(AI.card)                          //добавление разыгранной карты в "отбой"

                index = AI.deck.indexOf(AI.card)
                if (index > -1) {
                    AI.deck.splice(index, 1)           //удаление разыгранной карты из активной колоды
                }

                console.log('Противник выбрал карту "защиты" и выложил ее на стол')
                console.log('На столе лежат карта "атаки" = ' + YOU.card + ' и карта "защиты" = ' + AI.card)

                if (YOU.card > AI.card) {
                    AI.count += YOU.card - AI.card
                    YOU.didWin = true;
                    console.log('\nВаша карта оказалась сильнее, противнику начислены штрафные очки')
                } else {
                    console.log('\nПротивник смог отбить Вашу атаку')
                }

                console.log('\nАктуальный счет штрафных очков: ')
                console.log('Компьютер - ' + AI.count + ', Игрок - ' + YOU.count)
            }
            else {                                              //каждый шаг атаки ИИ приходится на нечетные значения счетчика i
                if (YOU.didWin) {                               //если игрок выиграл прошлый раунд, то велик шанс, что его карта была достаточно большая,
                                                                // и если выложить ее же на этом ходу, то можно выйти в плюс на несколько очков
                    AI.card = YOU.played[YOU.played.length - 1]
                    for (let j = 0; j < AI.played.length; j++) {
                        if (AI.card === AI.played[j]) {
                            if (AI.card === 11) {
                                AI.card = 0
                                j = 0
                            } else {
                                AI.card++
                                j = 0
                            }
                        }
                    }
                } else {                                       //иначе действует тактика, как в защите, атака просто растет с каждым шагом на 1, исключая уже разыгранные карты и выход за пределы колоды
                    AI.card = n++
                    for (let j = 0; j < AI.played.length; j++) {
                        if (AI.card === AI.played[j]) {
                            if (AI.card === 11) {
                                AI.card = 0
                                j = 0
                            } else {
                                AI.card++
                                j = 0
                            }
                        }
                    }
                }
                //далее все аналогично

                AI.played.push(AI.card)

                index = AI.deck.indexOf(AI.card)
                if (index > -1) {
                    AI.deck.splice(index, 1)
                }

                console.log('\nПротивник выбрал карту "атаки" и выложил ее на стол')

                console.log('Выберите карту "защиты"')
                do {
                    canPlay = true

                    YOU.card = readline.question('\t>')
                    YOU.card=parseInt(YOU.card)

                    if (isNaN(YOU.card)) {
                        console.log('Ваша карта должна быть числом! Повторите ввод')
                        canPlay = false
                    } else if (YOU.card > 11) {
                        console.log('Ваша карта не может быть больше 11! Повторите ввод')
                        canPlay = false
                    } else if (YOU.card < 0) {
                        console.log('Ваша карта не может быть отрицательным числом! Повторите ввод')
                        canPlay = false
                    } else {
                        for (let j = 0; j < YOU.played.length; j++) {
                            if (YOU.played[j] === YOU.card) {
                                console.log('Вы уже сыграли этой картой! Повторите ввод')
                                canPlay = false
                                break
                            }
                        }
                    }
                } while (!canPlay)

                YOU.played.push(YOU.card)

                index = YOU.deck.indexOf(YOU.card)
                if (index > -1) {
                    YOU.deck.splice(index, 1)
                }

                console.log('На столе лежат карта "атаки" = ' + AI.card + ' и карта "защиты" = ' + YOU.card)

                if (YOU.card < AI.card) {
                    YOU.count += AI.card - YOU.card
                    console.log('\nКарта противника оказалась сильнее, Вам начислены штрафные очки')
                } else {
                    console.log('\nПоздравляем, Вам удалось отбить атаку!')
                }

                console.log('\nАктуальный счет штрафных очков: ')
                console.log('Компьютер - ' + AI.count + ', Игрок - ' + YOU.count)
            }
        }
        //Вывод результата игры
        if (YOU.count < AI.count) {
            console.log('\nПоздравляем! Победа!')
        } else if (YOU.count > AI.count) {
            console.log('\nПоражение.')
        } else {
            console.log('\nНичья!')
        }

        break
    case 'AI':
        for (let i = 0; i < 12; i++) {                              //меняется логика относительно счетчика i, все наоборот
            str = ''
            console.log('\nУ Вас на руках карты:')
            for (let j = 0; j < YOU.deck.length; j++) {
                str += YOU.deck[j] + ' '
            }
            console.log(str)

            if (i % 2 === 0) {
                if (YOU.didWin) {
                    AI.card = YOU.played[YOU.played.length - 1]
                    for (let j = 0; j < AI.played.length; j++) {
                        if (AI.card === AI.played[j]) {
                            if (AI.card === 11) {
                                AI.card = 0
                                j = 0
                            } else {
                                AI.card++
                                j = 0
                            }
                        }
                    }
                } else {
                    AI.card = n++
                    for (let j = 0; j < AI.played.length; j++) {
                        if (AI.card === AI.played[j]) {
                            if (AI.card === 11) {
                                AI.card = 0
                                j = 0
                            } else {
                                AI.card++
                                j = 0
                            }
                        }
                    }
                }

                AI.played.push(AI.card)

                index = AI.deck.indexOf(AI.card)
                if (index > -1) {
                    AI.deck.splice(index, 1)
                }

                console.log('\nПротивник выбрал карту "атаки" и выложил ее на стол')

                console.log('Выберите карту "защиты"')
                do {
                    canPlay = true

                    YOU.card = readline.question('\t>')
                    YOU.card=parseInt(YOU.card)

                    if (isNaN(YOU.card)) {
                        console.log('Ваша карта должна быть числом! Повторите ввод')
                        canPlay = false
                    } else if (YOU.card > 11) {
                        console.log('Ваша карта не может быть больше 11! Повторите ввод')
                        canPlay = false
                    } else if (YOU.card < 0) {
                        console.log('Ваша карта не может быть отрицательным числом! Повторите ввод')
                        canPlay = false
                    } else {
                        for (let j = 0; j < YOU.played.length; j++) {
                            if (YOU.played[j] === YOU.card) {
                                console.log('Вы уже сыграли этой картой! Повторите ввод')
                                canPlay = false
                                break
                            }
                        }
                    }
                } while (!canPlay)

                YOU.played.push(YOU.card)

                index = YOU.deck.indexOf(YOU.card)
                if (index > -1) {
                    YOU.deck.splice(index, 1)
                }

                console.log('На столе лежат карта "атаки" = ' + AI.card + ' и карта "защиты" = ' + YOU.card)

                if (YOU.card < AI.card) {
                    YOU.count += AI.card - YOU.card
                    console.log('\nКарта противника оказалась сильнее, Вам начислены штрафные очки')
                } else {
                    console.log('\nПоздравляем, Вам удалось отбить атаку!')
                }

                console.log('\nАктуальный счет штрафных очков: ')
                console.log('Компьютер - ' + AI.count + ', Игрок - ' + YOU.count)
            }
            else {
                YOU.didWin = false

                console.log('\nВыберите карту "атаки"')
                do {
                    canPlay = true

                    YOU.card = readline.question('\t>')
                    YOU.card=parseInt(YOU.card)

                    if (isNaN(YOU.card)) {
                        console.log('Ваша карта должна быть числом! Повторите ввод')
                        canPlay = false
                    } else if (YOU.card > 11) {
                        console.log('Ваша карта не может быть больше 11! Повторите ввод')
                        canPlay = false
                    } else if (YOU.card < 0) {
                        console.log('Ваша карта не может быть отрицательным числом! Повторите ввод')
                        canPlay = false
                    } else {
                        for (let j = 0; j < YOU.played.length; j++) {
                            if (YOU.played[j] === YOU.card) {
                                console.log('Вы уже сыграли этой картой! Повторите ввод')
                                canPlay = false
                                break
                            }
                        }
                    }
                } while (!canPlay)

                YOU.played.push(YOU.card)

                index = YOU.deck.indexOf(YOU.card)
                if (index > -1) {
                    YOU.deck.splice(index, 1)
                }

                AI.card = m++
                for (let j = 0; j < AI.played.length; j++) {
                    if (AI.card === AI.played[j]) {
                        if (AI.card >= 11) {
                            AI.card = 0
                            j = 0
                        } else {
                            AI.card++
                            j = 0
                        }
                    }
                }

                AI.played.push(AI.card)

                index = AI.deck.indexOf(AI.card)
                if (index > -1) {
                    AI.deck.splice(index, 1)
                }

                console.log('Противник выбрал карту "защиты" и выложил ее на стол')
                console.log('На столе лежат карта "атаки" = ' + YOU.card + ' и карта "защиты" = ' + AI.card)

                if (YOU.card > AI.card) {
                    AI.count += YOU.card - AI.card
                    YOU.didWin = true;
                    console.log('\nВаша карта оказалась сильнее, противнику начислены штрафные очки')
                } else {
                    console.log('\nПротивник смог отбить Вашу атаку')
                }

                console.log('\nАктуальный счет штрафных очков: ')
                console.log('Компьютер - ' + AI.count + ', Игрок - ' + YOU.count)
            }
        }
        //Вывод результата игры
        if (YOU.count < AI.count) {
            console.log('\nПоздравляем! Победа!')
        } else if (YOU.count > AI.count) {
            console.log('\nПоражение.')
        } else {
            console.log('\nНичья!')
        }

        break
    default:
        console.log('\nНеизвестный вариант! Перезапустите программу')
        break
}
