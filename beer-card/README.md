# Beer card 🍺

A special card for Toast and his contribution to the community. A card that displays a multiline text in a nicer format.

![beer-card](https://user-images.githubusercontent.com/7738048/42560625-b7d18226-84ff-11e8-9f0a-59875edd642b.png)

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `custom:beer-card`
| entity | string | **Required** | The sensor to use for the list
| attribute | string | optional | The attribute of the entity to list. Default is 'list'
| title | string | optional | A card title
| icon | string | mdi:beer | An icon to display. Besides mdi icons, it supports images: png, jpg, svg, gif

## Configuration

Example:
```yaml
- type: custom:beer-card
  entity: sensor.beer_list
  attribute: list
  title: Toast Beer List
  icon: mdi:heart
```

Example with image icon:
```yaml
- type: custom:beer-card
  title: Untappd Wishlist
  entity: sensor.untappd_wishlist
  icon: /local/icons/untappd.png
```

❤️ To activate the cards set an attribute called `list` on the `sensor.beer_list` with any state.

![beer-value](https://user-images.githubusercontent.com/7738048/42560596-ac2627ce-84ff-11e8-965b-b82604645086.png)

## Credits
[ciotlosm](https://github.com/ciotlosm)
[iantrich](https://github.com/iantrich)