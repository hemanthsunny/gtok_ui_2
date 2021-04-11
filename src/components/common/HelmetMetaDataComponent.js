import React from 'react'
import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { gtokFavicon } from 'images'

export default function HelmetMetaDataComponent (props) {
  const location = useLocation()
  const currentUrl = props.currentUrl || ('https://beta.letsgtok.com' + location.pathname)
  const quote = props.quote || ''
  const title = props.title || 'Lets Gtok - Similar people at your finger tips'
  const image = props.image || gtokFavicon
  const description = props.description || 'Lets get to know each other. Share experiences and connect with similar people.' +
    'Trust us, its million dollars experience to find similar people and have an endless talk!' +
    'So, join us on this voyage, and explore the beauty and miracle of being yourself!'
  const hashtag = props.hashtag || '#Lets Gtok'
  const keywords = props.keywords || 'Lets Gtok, Lets Get to know each other'
  return (
    <Helmet>
      <title>{title}</title>
       <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
       <meta name='csrf_token' content='' />
       <meta property='type' content='webapp' />
       <meta property='url' content={currentUrl} />
       <meta name='_token' content='' />
      <meta name='robots' content='noodp' />
      <meta property='title' content={title} />
      <meta property='quote' content={quote} />
      <meta name='description' content={description} />
      <meta name='keywords' content= {keywords} />
      <meta property='image' content={image} />
      <meta property='og:locale' content='en_US' />
      <meta property='og:type' content='website' />
      <meta property='og:title' content={title} />
      <meta property='og:quote' content={quote} />
      <meta property='og:hashtag' content={hashtag} />
      <meta property='og:image' content={image} />
      <meta content='image/*' property='og:image:type' />
      <meta property='og:url' content={currentUrl} />
      <meta property='og:site_name' content='Lets Gtok' />
      <meta property='og:description' content={description} />
      <link rel='icon' type='image/png' href={gtokFavicon} sizes='16x16'/>
    </Helmet>
  )
}
