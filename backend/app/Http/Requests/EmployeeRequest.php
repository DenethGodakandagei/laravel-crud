<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
        // 'id' is ignored in the unique check during updates
        $id = $this->route('id'); 

        return [
            'name'        => 'required|string|min:2|max:255',
            'designation' => 'required|string|max:255',
        ];
    }
}