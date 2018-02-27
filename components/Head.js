import Head from 'next/head'
import config from '../config.js'

export default() =>
   <div>
    <Head>
      <title>{config.project_name} - {config.project_shortdesc}</title>
      <meta name="viewport" content="target-densitydpi=device-dpi, width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, minimal-ui" />
      <script type="text/javascript" src="./static/marzipano.js"></script>
      <link rel="stylesheet" href="https://unpkg.com/purecss@1.0.0/build/pure-min.css" media="screen"/>
    </Head>
   </div>
