const { Telegraf } = require('telegraf')
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN) // this is where the token given by botFather is placed
//------------------------------------------------ Dont touch anything above this line

bot.command(['start','help'], ctx => {
    let message = `
    welcome to the thai laundry shop
    Use the inline mode below
    @buysmth_bot pay <to pay for invoice>
    @buysmth_bot services <to see what services we offer>
    `;
    bot.telegram.sendMessage(ctx.chat.id, message,
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: 'Pay Invoice',callback_data:'p ' }
                    ],
                    [
                        {text: 'Search Services',callback_data:'S '}
                    ]
                ]
            }
        }

    )

});





/*bot.inlineQuery(['start','help'], ctx => {
    let message = `
    welcome to the thai laundry shop
    Use the inline mode below
    @buysmth_bot pay <to pay for invoice>
    @buysmth_bot services <to see what services we offer>
    `;

    let results = [
        {
            type: 'invoice',
            id: '1',
            title: 'Help Refence',
            input_message_content: {
                message_text: message
            },
            description:'send help on how to use the bot',
            reply_markup: {
                line_keyboard: [
                    [
                        { Text: 'Pay Invoice',switch_inline_query_current_chat:'p ' }
                    ],
                    [
                        {Text: 'Search Services',switch_inline_query_current_chat:'S '}
                    ]
                ]
            }
            }
        
    ]


});




bot.on('inline_query', async ({ inlineQuery, answerInlineQuery }) => {
    return answerInlineQuery({
        type: 'article',
        id: 'someID',
        title: 'someTitle',
        description: 'someDesc',
        thumb_url: 'img_url',
        url: 'url'
    })
}); 
*/



const getInvoice = (id) => {
    const invoice = {
      chat_id: id, // Unique identifier of the target chat or username of the target channel
      provider_token: process.env.PROVIDER_TOKEN, // token issued via bot @SberbankPaymentBot
      start_parameter: 'get_access', 
      // Unique parameter for deep links. If you leave this field blank, forwarded copies of the forwarded message will have a Pay button that allows multiple users to pay directly from the forwarded message using the same account. 
      //If not empty, redirected copies of the sent message will have a URL button with a deep link to the bot (instead of a payment button) with a value used as an initial parameter.
      
      title: 'The thai laundry shop', // Product name, 1-32 characters
      description: 'Use card number: 4242 4242 4242 4242, date: 12/34, CV:123', // Product description, 1-255 characters
      currency: 'SGD', // ISO 4217 Three-Letter Currency Code
      prices: [{ label: 'Invoice Title', amount: 100 * 100 }], // Price breakdown, serialized list of components in JSON format 100 kopecks * 100 = 100 rubles
      payload: { // The payload of the invoice, as determined by the bot, 1-128 bytes. This will not be visible to the user, use it for your internal processes.
        unique_id: `${id}_${Number(new Date())}`,
        provider_token: process.env.PROVIDER_TOKEN 
      },
      need_shipping_address: true,
      suggested_tip_amount: 400,
      max_tip_amount: 1000,
      photo_url: 'https://i.pinimg.com/originals/99/8c/08/998c0822cfdc42c6bdde44eb6ac80e1f.jpg',
      photo_width: 250,
      photo_height: 250
    }
  
    return invoice
  }
  
  bot.use(Telegraf.log())
  
  bot.hears('pay', (ctx) => {// this is a handler for a specific text, in this case it is "pay"
    return ctx.replyWithInvoice(getInvoice(ctx.from.id)) //  replyWithInvoice method for invoicing 
  })
  
  bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true)) // response to a preliminary request for payment
  
  bot.on('successful_payment', async (ctx, next) => { // reply in case of positive payment
    await ctx.reply('Thank you and we hope to see you again')
  })
  
  bot.catch((err) => {
    console.log('Ooops', err)
  })
  bot.launch()