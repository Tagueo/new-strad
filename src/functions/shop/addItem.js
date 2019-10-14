import { client } from '../../globals';

/**
 * @param  {MessageEmbed} embed
 * @param  {Object} item
 */
const addItem = (embed, item) => {
  const blockEmoji = client.assets.emojis.BLOCK;
  const discountEmoji = client.assets.emojis.DISCOUNT;
  if (item.discount > 100) item.discount = 100;
  else if (item.discount < 0) item.discount = 0;

  const notSaleableText = item.saleable
    ? 'Cet item peut être vendu.'
    : 'Cet item ne peut pas être vendu.';
  item.emoji = client.emojis.get(item.emoji);
  const discountText = item.discount > 0 ? ` • ${discountEmoji}` : '';
  const priceAfterDiscount = Math.round(
    item.price - item.price * (item.discount / 100)
  );
  const priceText =
    item.discount > 0
      ? `~~${item.price}~~ ${priceAfterDiscount} ${blockEmoji} (-${item.discount} %)`
      : `${item.price} ${blockEmoji}`;
  if (item.quantity === -1) item.quantity = '∞';
  embed.addField(
    `${item.emoji} ${item.buy_amount} x ${item.name}${discountText}`,
    `**Description :** ${item.description}
    **Prix :** ${priceText}
    **Stock :** ${item.quantity}
    **Numéro d'article :** ${item.id}
    ${notSaleableText}`
  );
};

export { addItem };
