<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    // Table name
    protected $table = 'employees';

    // Mass assignable fields
    protected $fillable = [
        'name',
        'designation'
    ];
}
