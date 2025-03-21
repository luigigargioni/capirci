﻿"""
Software License Agreement (MIT License)

@copyright Copyright (c) 2017 DENSO WAVE INCORPORATED

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
"""


# -*- coding:utf-8 -*-

class HResult:
    S_OK = 0
    S_FALSE = 1
    E_UNEXPECTED = -2147418113
    E_NOTIMPL = -2147467263
    E_OUTOFMEMORY = -2147024882
    E_INVALIDARG = -2147024809
    E_POINTER = -2147467261
    E_HANDLE = -2147024890
    E_ABORT = -2147467260
    E_FAIL = -2147467259
    E_ACCESSDENIED = -2147024891
    E_WINDOWS_MASK = -2146959361
    E_CAO_SEM_CREATE = -2147483136
    E_CAO_PROV_INVALID = -2147483135
    E_CAO_COMPUTER_NAME = -2147483134
    E_CAO_VARIANT_TYPE_NOSUPPORT = -2147483133
    E_CAO_OBJECT_NOTFOUND = -2147483132
    E_CAO_COLLECTION_REGISTERED = -2147483131
    E_CAO_THREAD_CREATE = -2147483129
    E_CAO_REMOTE_ENGINE = -2147483128
    E_CAO_REMOTE_PROVIDER = -2147483127
    E_CAO_NOT_WRITABLE = -2147483126
    E_CAO_CMD_EXECUTE = -2147483125
    E_CAO_PROV_NO_LICENSE = -2147483124
    E_CAO_PRELOAD = -2147483123
    E_CRDIMPL = -2147482624
    E_CAOP_SYSTEMNAME_INVALID = -2147482623
    E_CAOP_SYSTEMTYPE_INVALID = -2147482622
    E_CANCEL = -2147482621
    E_CAOP_NOT_WRITABLE = -2147482620
    E_TIMEOUT = -2147481344
    E_NO_LICENSE = -2147481343
    E_NOT_CONNECTED = -2147481342
    E_NOT_USE = -2147481341
    E_INVALID_CMD_NAME = -2147481340
    E_MAX_OBJECT = -2147481339
    E_WINSOCK_MASK = -2137915393
    S_EXECUTING = 2304
    E_INVALIDPACKET = -2147418112

    def succeeded(hr):
        return hr >= 0

    def failed(hr):
        return hr < 0


class ORiNException(Exception):
    def __init__(self, hr):
        self.hresult = hr
