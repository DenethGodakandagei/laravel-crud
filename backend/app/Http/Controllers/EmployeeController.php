<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Http\Requests\EmployeeRequest; // Import the custom request
use Illuminate\Http\JsonResponse;

class EmployeeController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Employee::all(), 200);
    }

    public function store(EmployeeRequest $request): JsonResponse
    {
        // $request->validated() is safer
        $employee = Employee::create($request->validated());
        return response()->json($employee, 201);
    }

    public function show($id): JsonResponse
    {
        $employee = Employee::find($id);
        return $employee 
            ? response()->json($employee, 200) 
            : response()->json(['message' => 'Not found'], 404);
    }

    public function update(EmployeeRequest $request, $id): JsonResponse
    {
        $employee = Employee::find($id);
        if (!$employee) return response()->json(['message' => 'Not found'], 404);
        
        $employee->update($request->validated());
        return response()->json($employee, 200);
    }

    public function destroy($id): JsonResponse
    {
        $employee = Employee::find($id);
        if (!$employee) return response()->json(['message' => 'Not found'], 404);
        
        $employee->delete();
        return response()->json(['message' => 'Deleted'], 200);
    }
}