<?php
/*
   Plugin Name: Use Audio
   Version: 0.0.1
   Plugin URI: https://github.com/jackbilestech/use-audio-wordpress
   Author: Jack Biles
   Author URI: https://jackbilestech.com
   Description: A library to use microphone(s) in the browser
   License: GPLv2 or later
*/

/**
 * Prevent Direct Access
 */
defined( 'ABSPATH' ) or die( 'No direct access!' );

add_action( 'init', 'setup'); // On program load
add_action( 'admin_init', 'setup_admin'); // On program load

require_once(plugin_dir_path( __FILE__ ) . 'config.php');


$plugin_url = plugin_dir_url( __FILE__ );

class Plugin_Page {
    public $php_file;
    public $name;

    public function __construct(){
        
    }
    
    public function load(){
        
        echo require($this->php_file);
    }
    
}

class MenuPageParams{
    public $app_name = "";

    public function __construct() {
    }
}

class Plugin_Settings_Menu {
    public $app_name;
    public $slug = "";
    public $pages = [];
    public $home_page;
    public function __construct( MenuPageParams $params) {
        // Hook into the admin menu
        $this->app_name = $params->app_name;
    }
    public function render(){
        add_action( 'admin_menu', array( $this, 'create_plugin_settings_page' ) );
    }
    public function create_plugin_settings_page() {
        // Add the menu item and page
        $page_title = 'Audio Handler Settings';
        $menu_title = $this->app_name;
        $capability = 'manage_options';
        $this->slug = 'smashing_fields';
        $callback = array( $this->home_page, 'load' );
        $icon = 'dashicons-microphone';
        $position = 100;
    
        add_menu_page( $page_title, $menu_title, $capability, $this->slug, $callback, $icon, $position );

        for ($i=0; $i < count($this->pages); $i++) { 
            add_submenu_page( $this->slug, $this->pages[$i]->name, $this->pages[$i]->name , 'manage_options', 'woo-wholesale-registrations', array( $this->pages[$i], 'load' ) );
        }
        
    }
    public function add_page(Plugin_Page $page){
       $this->pages[] = $page;
    }
}

class ConfigParam{
    public $value;
    public $type;
    public $label;
    public $html;

    public function setValue($val){
        $this->value = $val;
        $this->type = gettype($val);
    }
}

class CONFIG {
    public $mic_mute;

    public function __construct() {
        $this->mic_mute = new ConfigParam();
        $this->mic_mute->setValue(true);
        $this->mic_mute->label = "Microphone Will Start Muted?";
    }
}

$myMenuParams = new MenuPageParams();
$myMenuParams->app_name = "Audio Handler";
$myMenu = new Plugin_Settings_Menu($myMenuParams);

class settings_page extends Plugin_Page{

    public function __construct(){

        $this->name = "Settings";
        $this->php_file = "admin/settings/index.php";
        $this->pre_load();
    }

    public function pre_load() {
        $plugin_url = plugin_dir_url( __FILE__ );
        wp_enqueue_script('admin-settings-javascript', $plugin_url . '/admin/settings/index.js', array('jquery') );
    
        wp_localize_script( 'admin-settings-javascript', 'myAjax', array( 'ajax_url' => admin_url( 'admin-ajax.php' ) ) ); //Deploy statically to client with AJAX credentials
        add_action('wp_ajax_settings', array($this, 'settings')); //Private ajax request
        add_action('wp_ajax_reset_settings', array($this, 'reset_settings')); //Private ajax request
        //add_action('wp_ajax_nopriv_upload_settings', array($this, 'upload_settings')); //Private ajax request
    }
    public function settings(){
        
        if($_GET){
            $this->get_settings();
        }
        else if($_POST){
            $params = array(new CONFIG());
            parse_str($_POST["form"], $params);

            $payload = $this->save_settings($params);

            echo json_encode($payload);

        }
        else{
            echo json_encode("error");
        }
        die();
    }
    private function save_settings($settings){
        $config_file = plugin_dir_path( __FILE__ ) . '/store/config.json';
        

       

        $str = file_get_contents($config_file); //Get contents of file
        $saved_json = json_decode($str, true); // decode the JSON into an associative array
        $new_json = $settings;
        $toSave = $saved_json;

        foreach($saved_json as $key => $prop) 
        {
            if($new_json[$key]){
                $toSave[$key]["value"] = $new_json[$key];
            }
        }

        $fp = fopen($config_file, 'w');
        fwrite($fp, json_encode($toSave)); //Write config class to file as JSON
        
        fclose($fp);

        return $toSave;
    }
    private function load_settings(){
        $config_file = plugin_dir_path( __FILE__ ) . '/store/config.json';
        if( !file_exists($config_file) ){

            // no config exsists, create default config
            $fp = fopen($config_file, 'w');
            fwrite($fp, json_encode(new CONFIG() )); //Write config class to file as JSON
            
            fclose($fp);
        }

        $str = file_get_contents($config_file); //Get contents of file
        return json_decode($str, true); // decode the JSON into an associative array
    }
    public function get_settings(){

        $json = $this->load_settings();
        $payload = new CONFIG();

        foreach($json as $key => $prop) 
        {
            $payload->$key = $prop;
        }

        echo json_encode($payload);
        
    }
    public function reset_settings(){
        $config_file = plugin_dir_path( __FILE__ ) . '/store/config.json';
        if( !file_exists($config_file) ){
            $fp = fopen($config_file, 'w');
            fwrite($fp, json_encode(new CONFIG() ));
            
            fclose($fp);
        }
        die();
    }
    private function get_animations(){
        $plugin_url = plugin_dir_url( __FILE__ );

        $files = scandir(plugin_dir_path( __FILE__ ) . '/store/animations/');
        echo json_encode(array_diff($files, array('.', '..')));
    }

}

$myMenu->home_page = new settings_page();

// $animations_page = new Plugin_Page();
// $animations_page->name = "Animations";
// $animations_page->php_file = "admin/animation/index.php";
// $myMenu->add_page($animations_page);


$myMenu->render();


function setup(){
    
    wp_enqueue_script('jquery'); // Load jQuery
    wp_enqueue_script( 'audio-handler', plugins_url( './libs/index.js', __FILE__ ) ); //Load JS file
    //wp_enqueue_script( 'audio-handler-index', plugins_url( 'index.js', __FILE__ ) ); //Load JS file

    add_shortcode( 'getMicrophone', 'loadMicrophone' ); // Load shortcode
    //add_shortcode( 'microphoneAnalysis', 'loadAnalysisWindow' ); // Load shortcode

}

function setup_admin(){

    $plugin_url = plugin_dir_url( __FILE__ );

    //Styling
    wp_enqueue_style('admin-bootstrap', $plugin_url . '/admin/libs/bootstrap/css/bootstrap.min.css' );
    
    

}

function loadAnalysisWindow($atts = []){
    
    $a = shortcode_atts( array(
		'id' => ""
    ), $atts );

    return '
    
    <div class="container">
        <canvas id="' . $a['id'] .'" ></canvas>
    </div>
    
    ';
    die();
}
function loadMicrophone($atts = []) { 
    $a = shortcode_atts( array(
        'controls' => false,
        'id' => "microphoneControls"
    ), $atts );

    if($a['controls'] == "show"){
        //Show controls
        return '
    
        <div class="container" id="'. $a['id'] . '">
            <div class="row">
                <div class="col">
                    <button class="btn btn-primary" id="start_microphone">START</button>
                </div>
                <div class="col">
                    <button class="btn btn-primary" id="mute_microphone">MUTE</button>
                </div>
                <div class="col">
                    <button class="btn btn-primary" id="stop_microphone">STOP</button>
                </div>
            </div>
        </div>';
    }else{
        //Hide controls
        return '
        <div class="container" id="microphoneControls"></div>
        <script>
            if(Microphone){
                try{
                    const mic = new Microphone();
                    mic.getStream()
                }catch(e){

                }

                //Do thing siwth the microphone
            }
            
        </script>
        ';
    }
    
   

    die();
}