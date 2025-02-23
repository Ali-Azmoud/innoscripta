<?php

namespace App\Repositories\Interfaces;

use Illuminate\Http\Request;
use App\Models\User;

interface AuthRepositoryInterface
{
    public function registerUser(array $data): User;
    public function findUserByEmail(string $email): ?User;
}
