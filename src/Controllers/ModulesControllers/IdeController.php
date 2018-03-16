<?php

namespace Lia\Controllers\ModulesControllers;

use Illuminate\Http\Request;
use Lia\Addons\Modules\Facades\Module;
use Help\Filemanager\PHPFileSystem;

class IdeController {

    public function cmd(Request $request)
    {
        if($request->cmd){
            if(!($mod = Module::find($request->module))){
                return response(['status' => 'error', 'message' => "Module [{$request->module}] not found!"]);
            }
            if (method_exists($this, $method = 'cmd' . ucfirst(studly_case(strtolower($request->cmd))) . 'Method')) {
                return $this->$method($request, $mod);
            } else {
                return response(['status' => 'error', 'message' => 'CMD not found!']);
            }
        }
    }

    private function cmdGetFileMethod(Request $request){
        $path = module_path($request->module);
        return file_get_contents($path.'/'.$request->getContent);
    }

    private function cmdGetLogMethod(Request $request){
        $path = module_path($request->module);
        if(!is_file($path.'/output.log')) return response([]);
        $log = file_get_contents($path.'/output.log');
        $return = [];
        foreach (explode("\n", $log) as $line){
            $line = explode(';', $line);
            if(isset($line[1])) $return[] = ['date' => $line[0], 'message' => $line[1]];
        }
        return response(array_reverse($return));
    }

    private function cmdLogWriteMethod(Request $request){
        $path = module_path($request->module);
        $file = $path.'/output.log';
        $fp = fopen($file, 'a');
        fwrite($fp, now().";".$request->message."\n");
        fclose($fp);
        return response(['date' => now()->toDateTimeString(), 'message' => $request->message]);
    }

    private function cmdGetFilesystemMethod(Request $request, $mod){
        $file = new PHPFileSystem(module_path($request->module));
        $file->virtualRoot($request->module);
        $data = $file->ls(($request->parent ? $request->parent : '/'), false, "branch");
        $files = [];
        foreach ($data[0]['data'] as $file){
            if($file['value']=='output.log') continue;
            $file['icon'] = $this->setIcon($file['type']);
            $file['value'] = $this->setColor($file['value'], $file['type']);
            if($file['type']=='folder') $file['webix_kids'] = 1;
            unset($file['webix_branch'], $file['webix_child_branch']);
            $files[] = $file;
        }
        $data = false;
        if($request->parent) {
            $data['data'] = $files;
            $data['parent'] = $request->parent;
        }
        return response($data ? $data : $files);
        dd($files);
    }

    private function setIcon($type)
    {
        $icons = [
            'folder' => 'folder-o',
            'code' => 'file-code-o',
            'text' => 'file-text-o',
            'image' => 'file-image-o',
            'archive' => 'file-zip-o',
            'audio' => 'file-audio-o',
            'video' => 'file-movie-o',
            'excel' => 'file-excel-o',
            'doc' => 'file-word-o'
        ];
        if(isset($icons[$type])) return $icons[$type];
        else return 'file-o';
    }

    private function setColor($value, $type)
    {
        $colors = [
            'folder' => 'white; font-weight: bold',
            'code' => 'lime',
            'text' => '#f1f1f1',
            '' => 'red',
            'image' => '#8a8aff',
            'archive' => '#e200fb',
        ];
        $color = isset($colors[$type]) ? $colors[$type] : '#f1f1f1';
        return "<span style='color: {$color};'>{$value}</span>";
    }

}