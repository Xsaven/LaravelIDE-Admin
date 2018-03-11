<?php

namespace Lia\Addons\Scaffold;

use Illuminate\Support\Str;

class FactoryCreator
{
    /**
     * Table name.
     *
     * @var string
     */
    protected $tableName;

    /**
     * Model name.
     *
     * @var string
     */
    protected $name;

    /**
     * The filesystem instance.
     *
     * @var \Illuminate\Filesystem\Filesystem
     */
    protected $files;

    /**
     * FactoryCreator constructor.
     *
     * @param string $tableName
     * @param string $name
     * @param null   $files
     */
    public function __construct($tableName, $name, $files = null)
    {
        $this->tableName = $tableName;

        $this->name = $name;

        $this->files = $files ?: app('files');
    }

    /**
     * Create a new factory file.
     *
     * @param string     $keyName
     * @param bool|true  $timestamps
     * @param bool|false $softDeletes
     *
     * @throws \Exception
     *
     * @return string
     */
    public function create($timestamps = true, $softDeletes = false, $fields=[])
    {
        $path = $this->getpath($this->name);

        if ($this->files->exists($path)) {
            throw new \Exception("Factory [$this->name] already exists!");
        }

        $stub = $this->files->get($this->getStub());

        $stub = $this->replaceClass($stub, $this->name)
            ->replaceNamespace($stub, $this->name)
            ->replaceFakerArray($stub, $fields, $timestamps, $softDeletes)
            ->replaceSpace($stub);

        $this->files->put($path, $stub);

        return $path;
    }

    /**
     * Get path for migration file.
     *
     * @param string $name
     *
     * @return string
     */
    public function getPath($name)
    {
        $segments = explode('\\', $name);

        array_shift($segments);

        return database_path('factories/'.ucfirst(array_last($segments))).'Factory.php';
    }

    /**
     * Get namespace of giving class full name.
     *
     * @param string $name
     *
     * @return string
     */
    protected function getNamespace($name)
    {
        return trim(implode('\\', array_slice(explode('\\', $name), 0, -1)), '\\');
    }

    /**
     * Replace class dummy.
     *
     * @param string $stub
     * @param string $name
     *
     * @return $this
     */
    protected function replaceClass(&$stub, $name)
    {
        $class = str_replace($this->getNamespace($name).'\\', '', $name);

        $stub = str_replace('DummyClass', $class, $stub);

        return $this;
    }

    /**
     * Replace namespace dummy.
     *
     * @param string $stub
     * @param string $name
     *
     * @return $this
     */
    protected function replaceNamespace(&$stub, $name)
    {
        $stub = str_replace(
            'DummyNamespace', $this->getNamespace($name), $stub
        );

        return $this;
    }

    /**
     * Replace Faker array dummy.
     *
     * @param string $stub
     * @param string $name
     *
     * @return $this
     */
    protected function replaceFakerArray(&$stub, $fields, $timestamps, $softDeletes)
    {
        $array = [];

        foreach ($fields as $f){
            if(!empty($f['fakerGroup']) && !empty($f['fakerFunction'])){
                $modifier = !empty($f['fakerModifier']) ? "{$f['fakerModifier']}()->":"";
                $params = !empty($f['fakerFunctionParams']) ? "({$f['fakerFunctionParams']})":"";
                $array[] = "\"{$f['name']}\" => \$faker->{$modifier}{$f['fakerFunction']}{$params}";
            }
        }
        if($timestamps){
            $array[] = "\"created_at\" => now()";
            $array[] = "\"updated_at\" => now()";
        }
        if($softDeletes)
            $array[] = "\"deleted_at\" => NULL";

        if(count($array)) $array = trim(implode(str_repeat(' ', 6), $array), "\n");
        else $array = "";

        $stub = str_replace('DummyFakerArray', $array, $stub);

        return $this;
    }

    /**
     * Replace spaces.
     *
     * @param string $stub
     *
     * @return mixed
     */
    public function replaceSpace($stub)
    {
        return str_replace(["\n\n\n", "\n    \n"], ["\n\n", ''], $stub);
    }

    /**
     * Get stub path of model.
     *
     * @return string
     */
    public function getStub()
    {
        return __DIR__.'/stubs/factory.stub';
    }
}