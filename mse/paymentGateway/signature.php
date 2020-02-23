<?php
/**
 * Notes:
 * - All lines with the suffix "// DEBUG" are for debugging purposes and
 *   can safely be removed from live code.
 * - Remember to set PAYFAST_SERVER to LIVE for production/live site
 * - If there is a passphrase set on the sandbox account, include it on line 68
 */
include_once("../connection.php");
// General defines
define( 'PAYFAST_SERVER', 'TEST' ); // Whether to use "sandbox" test server or live server
define( 'USER_AGENT', 'Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)' ); // User Agent for cURL

// Error Messages
define( 'PF_ERR_AMOUNT_MISMATCH', 'Amount mismatch' );
define( 'PF_ERR_BAD_SOURCE_IP', 'Bad source IP address' );
define( 'PF_ERR_CONNECT_FAILED', 'Failed to connect to PayFast' );
define( 'PF_ERR_BAD_ACCESS', 'Bad access of page' );
define( 'PF_ERR_INVALID_SIGNATURE', 'Security signature mismatch' );
define( 'PF_ERR_CURL_ERROR', 'An error occurred executing cURL' );
define( 'PF_ERR_INVALID_DATA', 'The data received is invalid' );
define( 'PF_ERR_UNKNOWN', 'Unknown error occurred' );

// General Messages
define( 'PF_MSG_OK', 'Payment was successful' );
define( 'PF_MSG_FAILED', 'Payment has failed' );

// Notify PayFast that information has been received
header( 'HTTP/1.0 200 OK' );
flush();

// Variable initialization
$pfError = false;
$pfErrMsg = '';
$filename = 'notify.txt'; // DEBUG
$output = ''; // DEBUG
$pfParamString = '';
$pfHost = ( PAYFAST_SERVER == 'LIVE' ) ? 'www.payfast.co.za' : 'sandbox.payfast.co.za';
$pfData = array();
$output = "ITN Response Received\n\n";

//// Dump the submitted variables and calculate security signature
if ( !$pfError )
{
    $output .= "Posted Variables:\n"; // DEBUG

    // Strip any slashes in data
    foreach ( $_POST as $key => $val )
    {
        $pfData[$key] = stripslashes( $val );
        $output .= "$key = $val\n";
    }

    // Dump the submitted variables and calculate security signature
    foreach ( $pfData as $key => $val )
    {
        if ( $key != 'signature' )
        {
            $pfParamString .= $key . '=' . urlencode( $val ) . '&';
        }

    }

    // Remove the last '&' from the parameter string
    $pfParamString = substr( $pfParamString, 0, -1 );
    $pfTempParamString = $pfParamString;

    // If a passphrase has been set in the PayFast Settings, include it in the signature string.
    $passPhrase = ''; //You need to get this from a constant or stored in your website/database
    if ( !empty( $passPhrase ) )
    {
        $pfTempParamString .= '&passphrase=' . urlencode( $passPhrase );
    }
    $signature = md5( $pfTempParamString );
    echo json_encode($signature);
}



