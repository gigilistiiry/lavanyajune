import React, { Component } from 'react';
import StartFirebase from './configFirebase/index';
import { ref, set, onValue, remove } from 'firebase/database';
import {
  Autocomplete, Box,
  Button, Card, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid,
  IconButton, InputAdornment, InputLabel, MenuItem, Modal, OutlinedInput, Radio, RadioGroup,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TextField, Typography
} from '@mui/material';
import './App.css';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Cancel, CheckCircle, Close, Delete, FormatListBulleted, Help, Logout, Menu, PersonAddAlt, Print, Search, Visibility, VisibilityOff } from '@mui/icons-material';
import moment from 'moment';
import PreviewFrom from './previewPasien/previewFrom';
import { Document, Page, View, PDFViewer } from "@react-pdf/renderer";

const db = StartFirebase();

const page = {
  backgroundColor: "white",
  color: "black",
  fontSize: 12
}

const viewer = {
  width: '1000px',
  height: window.innerHeight,
}

const section = {
  margin: 10,
  padding: 10,
}

const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid grey',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const styleModalForm = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  height: 500,
  bgcolor: 'background.paper',
  border: '1px solid grey',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
};

const listDokterObgyn = [
  'dr. Ani Supriatni, SpOG', 'dr. Anita Rachmawati, SpOG (K-FER)', 'dr. Anna Fachruriyah, SpOG',
  'dr. Asri Kurnia Dewi, SpOG', 'dr. Dina Erasvina, SpOG', 'dr. Herry Aktyar Matondang, SpOG',
  'dr. Lina Karlina, SpOG', 'dr. M Alamsyah, SpOG, KMF(KIC)', 'dr. Raden Ahyar Nugraha, SpOG',
  'dr. Rina Eka Puspitasari, SpOG', 'dr. Risa Risfandi SpOG', 'dr. Umar Seno W., SpOG (K)-KFM., M.Kes',
  'dr. Yudo Siswo Utomo, SpOG'
];

class Form extends Component {
  state = {
    dataTable: [],
    database: '',
    menuListPatien: true,
    menuAddPatient: false,
    showMenu: false,

    // Value Form
    noRM: '',
    fullName: '',
    age: '',
    gender: '',
    drBedah: '',
    drAnastesi: '',
    dateOperasi: '',
    ruangan: '',
    perawat: '',
    dxPraBedah: '',
    dxPascaBedah: '',
    dxTindakan: '',
    macamPembedahan: '',
    jenisPembedahan: '',
    dieksisi: '',
    sendPA: false,
    anastesi: '',
    jamMulai: '',
    jamAkhir: '',
    durasiOperasi: {
      jam: '',
      menit: ''
    },
    laporanOperasi: '',
    page: 1,
    limit: 2,
    modalSubmit: false,
    loading: false,
    modalDelete: false,
    pasienDelete: [],
    dataDxPrimary: [],
    dataDxSecondary: [],
    dataDxTindakan: [],
    search: '',
    preliminaryData: [],
    showPreview: false,
    idData: '',
    isLogin: false,
    nama: '',
    password: '',
    showPassword: false,
    errorLogin: false,
    valLogin: localStorage.getItem('login')
  }

  componentDidMount() {
    this._handleFilldataDxPrimary();
    this._handleFilldataDxSecondary();
    this._handleFillDataICD9();
    const dbRef = ref(db, 'pasien')
    this.setState({
      database: StartFirebase(),
      // valLogin: localStorage.getItem('login')
    })
    onValue(dbRef, (snapshot) => {
      let records = [];
      snapshot.forEach(childSnapshot => {
        let data = childSnapshot.val();
        records.push(data);
      });
      this.setState({ dataTable: records, preliminaryData: records })
    })
  }

  // componentDidUpdate(prevState) {
  //   if (prevState.valLogin !== localStorage.getItem('login')) {
  //     this._handleFillLogin();
  //   }
  // }

  // _handleFillLogin = () => {
  //   this.setState({ valLogin: localStorage.getItem('login') })
  // }

  _handleChangeSearch = (e) => {
    e.preventDefault();
    this.setState({ search: e.target.value }, () => {
      this._handleSearchPatient();
    });
  }

  _handleSearchPatient = () => {
    const { search } = this.state;
    let searchPatient = this.state.preliminaryData.filter((val) => {
      return val?.fullName.toLowerCase().includes(search.toLowerCase()) ||
        val?.noRM.toLowerCase().includes(search.toLowerCase());
    }
    );
    this.setState({ dataTable: searchPatient });
  }

  _handleLogin = () => {
    const { nama, password } = this.state;
    if (nama === 'acatanty' && password === 'acatanty') {
      this.setState({ isLogin: true });
      localStorage.setItem('login', true);
      window.location.reload();
    } else {
      this.setState({ errorLogin: true })
    }
  }

  _handleFilldataDxPrimary = async () => {
    const { dxPraBedah } = this.state;
    const response10 = await fetch(`https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&authenticity_token=&terms=${dxPraBedah}`);
    const data10 = await response10?.json();
    this.setState({ dataDxPrimary: data10 });
  }

  _handleFilldataDxSecondary = async () => {
    const { dxPascaBedah } = this.state;
    const response10 = await fetch(`https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&authenticity_token=&terms=${dxPascaBedah}`);
    const data10 = await response10?.json();
    this.setState({ dataDxSecondary: data10 });
  }

  _handleFillDataICD9 = async () => {
    const { dxTindakan } = this.state;
    const response9 = await fetch(`https://clinicaltables.nlm.nih.gov/api/icd9cm_dx/v3/search?authenticity_token=&terms=${dxTindakan}`);
    const data9 = await response9?.json();
    this.setState({ dataDxTindakan: data9 });
  }

  getAllData = () => {
    return {
      noRM: this.state.noRM,
      fullName: this.state.fullName,
      age: this.state.age,
      gender: this.state.gender,
      drBedah: this.state.drBedah,
      drAnastesi: this.state.drAnastesi,
      ruangan: this.state.ruangan,
      perawat: this.state.perawat,
      dxPraBedah: this.state.dxPraBedah,
      dxPascaBedah: this.state.dxPascaBedah,
      dxTindakan: this.state.dxTindakan,
      dateOperasi: this.state.dateOperasi,
      macamPembedahan: this.state.macamPembedahan,
      jenisPembedahan: this.state.jenisPembedahan,
      dieksisi: this.state.dieksisi,
      sendPA: this.state.sendPA,
      anastesi: this.state.anastesi,
      jamMulai: this.state.jamMulai,
      jamAkhir: this.state.jamAkhir,
      durasiOperasi: {
        jam: this.state.durasiOperasi?.jam,
        menit: this.state.durasiOperasi?.menit,
      },
      laporanOperasi: this.state.laporanOperasi
    };
  }

  _handleSaveData = () => (e) => {
    e.preventDefault();
    let db = this.state.database;
    let data = this.getAllData();

    set(ref(db, 'pasien/' + data.noRM), {
      noRM: data.noRM,
      fullName: data.fullName,
      age: data.age,
      gender: data.gender,
      drBedah: data.drBedah,
      drAnastesi: data.drAnastesi,
      ruangan: data.ruangan,
      perawat: data.perawat,
      dxPraBedah: data.dxPraBedah,
      dxPascaBedah: data.dxPascaBedah,
      dxTindakan: data.dxTindakan,
      dateOperasi: data.dateOperasi,
      macamPembedahan: data.macamPembedahan,
      jenisPembedahan: data.jenisPembedahan,
      dieksisi: data.dieksisi,
      sendPA: data.sendPA,
      anastesi: data.anastesi,
      jamMulai: data.jamMulai,
      jamAkhir: data.jamAkhir,
      durasiOperasi: {
        jam: data.durasiOperasi?.jam,
        menit: data.durasiOperasi?.menit,
      },
      laporanOperasi: data.laporanOperasi
    })

    this.setState({ modalSubmit: true, loading: true },
      () => setTimeout(() => this.setState({ loading: false }), 500))
  }

  _handleDelete = (id) => () => {
    let items = (this.state.dataTable || []).filter(val => val?.noRM === id);
    this.setState({ pasienDelete: items, modalDelete: true })
  }

  _handleChangeValuePraBedah = (e, val) => {
    this.setState({ dxPraBedah: val });
  }

  _handleChangeValueTindakan = (e, val) => {
    this.setState({ dxTindakan: val });
  }

  _handleChangeValuePascaBedah = (e, val) => {
    this.setState({ dxPascaBedah: val });
  }

  _handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword })
  }

  _changeValPraBedah = (e) => {
    this.setState({ dxPraBedah: e.target.value }, () => this._handleFilldataDxPrimary());
  }

  _changeValPascaBedah = (e) => {
    this.setState({ dxPascaBedah: e.target.value }, () => this._handleFilldataDxSecondary());
  }

  _changeValTindakan = (e) => {
    this.setState({ dxTindakan: e.target.value }, () => this._handleFillDataICD9());
  }

  _handleRemovePasien = (type, noRM) => (e) => {
    e.preventDefault();
    if (type === 'back') {
      this.setState({ modalDelete: false })
    } else {
      remove(ref(db, 'pasien/' + noRM));
      this.setState({ modalDelete: false });
    }
  }

  // _handleChangeRowsPerPage = (event, value) => {
  //   this.setState({
  //     page: value,
  // dataTable: this.state.dataTable.slice(0 + this.state.limit * (value - 1), this.state.limit * value)
  //   });
  // }

  _handleChangeDateOperasi = (e) => {
    this.setState({
      dateOperasi: moment(e.target.value).format('DD/MM/YYYY')
    })
  }

  _handleChangeGender = (e) => {
    this.setState({ gender: e.target.value })
  }

  _handleChangesendPA = (e) => {
    this.setState({ sendPA: e.target.value })
  }

  _handleChangeJamOperasi = (e) => {
    this.setState({
      durasiOperasi: {
        ...this.state.durasiOperasi,
        jam: e.target.value
      }
    })
  }

  _handleChangeMenitOperasi = (e) => {
    this.setState({
      durasiOperasi: {
        ...this.state.durasiOperasi,
        menit: e.target.value
      }
    })
  }

  _handleChangeJamMulai = (category) => {
    if (category === 'Invalid date') {
      this.setState({ jamMulai: '' })
    } else {
      this.setState({
        jamMulai: moment(category?.$d).locale('id').format('LT')
      })
    }
  }

  _handleChangeLogin = (e) => {
    this.setState({ [e.target.name]: e.target.value, errorLogin: false })
  }

  _handleChangeJamAkhir = (category) => {
    if (category === 'Invalid date') {
      this.setState({ jamAkhir: '' })
    } else {
      this.setState({
        jamAkhir: moment(category?.$d).locale('id').format('LT')
      })
    }
  }

  _handleMenu = () => {
    this.setState({ showMenu: !this.state.showMenu })
  }

  _handleContent = (type) => () => {
    if (type === 'addPatient') {
      this.setState({
        menuAddPatient: true,
        menuListPatien: false,
        showMenu: false,
        modalSubmit: false,

        // Clear Form
        noRM: '',
        fullName: '',
        age: '',
        gender: '',
        drBedah: '',
        drAnastesi: '',
        dateOperasi: '',
        ruangan: '',
        perawat: '',
        dxPraBedah: '',
        dxPascaBedah: '',
        dxTindakan: '',
        macamPembedahan: '',
        jenisPembedahan: '',
        dieksisi: '',
        sendPA: false,
        anastesi: '',
        jamMulai: '',
        jamAkhir: '',
        durasiOperasi: {
          jam: '',
          menit: ''
        },
        laporanOperasi: '',
      });
    } else if (type === 'logout') {
      this.setState({ isLogin: false });
      localStorage.removeItem('login');
      window.location.reload();
    } else {
      this.setState({
        menuAddPatient: false,
        menuListPatien: true,
        showMenu: false,
        modalSubmit: false,

        // Clear Form
        noRM: '',
        fullName: '',
        age: '',
        gender: '',
        drBedah: '',
        drAnastesi: '',
        dateOperasi: '',
        ruangan: '',
        perawat: '',
        dxPraBedah: '',
        dxPascaBedah: '',
        dxTindakan: '',
        macamPembedahan: '',
        jenisPembedahan: '',
        dieksisi: '',
        sendPA: false,
        anastesi: '',
        jamMulai: '',
        jamAkhir: '',
        durasiOperasi: {
          jam: '',
          menit: ''
        },
        laporanOperasi: '',
      });
    }
  }

  _handleChangeValue = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  _handleChange = (e) => {
    if (e.target.name === 'laporanOperasi' && e.target.value.length > 100) return;
    this.setState({ [e.target.name]: e.target.value })
  }

  _handleShowHTML = (id) => (e) => {
    e.preventDefault();
    this.setState({ showPreview: !this.state.showPreview, idData: id });
  }

  _handleClosePreview = () => {
    this.setState({ showPreview: false, idData: '' });
  }

  _renderLeft = () => {
    return (
      <Grid item xs={4}>
        <TextField
          className='wrappField'
          label="No RM"
          name='noRM'
          fullWidth
          onChange={this._handleChangeValue}
          variant="outlined"
        />
        <TextField
          className='wrappField'
          label="Nama Lengkap"
          name='fullName'
          fullWidth
          onChange={this._handleChangeValue}
          variant="outlined"
        />
        <TextField
          className='wrappField'
          label="Umur"
          InputProps={{
            endAdornment: <InputAdornment position="end">Tahun</InputAdornment>,
          }}
          name='age'
          fullWidth
          onChange={this._handleChangeValue}
          variant="outlined"
        />
        <FormControl className='wrappField'>
          <FormLabel>Jenis Kelamin</FormLabel>
          <RadioGroup row onChange={this._handleChangeGender} value={this.state.gender}>
            <FormControlLabel value="Laki-laki" control={<Radio />} label="Laki-laki" />
            <FormControlLabel value="Perempuan" control={<Radio />} label="Perempuan" />
          </RadioGroup>
        </FormControl>
        <TextField
          className='wrappField'
          id="outlined-select-currency"
          select
          label="Ruang Rawat Inap"
          fullWidth
          name='ruangan'
          onChange={this._handleChangeValue}
          variant="outlined"
        >
          {['Rio', 'Riu', 'Reg', 'Wing Sel'].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          className='wrappField'
          id="outlined-select-currency"
          select
          label="Ahli Bedah"
          fullWidth
          name='drBedah'
          onChange={this._handleChangeValue}
          variant="outlined"
        >
          {listDokterObgyn.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          className='wrappField'
          id="outlined-select-currency"
          select
          label="Ahli Anastesi"
          fullWidth
          name='drAnastesi'
          onChange={this._handleChangeValue}
          variant="outlined"
        >
          {['dr. Lutfhi R. Tambora, SpAn'].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <div className='wrappLabel'>Tanggal Operasi</div>
        <TextField
          className='wrappField'
          type='date'
          fullWidth
          name='dateOperasi'
          onChange={this._handleChangeDateOperasi}
          variant="outlined"
        />
      </Grid>
    );
  }

  _renderCenter = () => {
    return (
      <Grid item xs={4}>
        <TextField
          className='wrappField'
          id="outlined-select-currency"
          select
          label="Perawat/ Instrumen"
          fullWidth
          name='perawat'
          onChange={this._handleChangeValue}
          variant="outlined"
        >
          {['Mega Lestiary, S.Kep.,Ners', 'Tantan Permadi, A.Md.Kep', 'Eki Nurdiansyah, A.Md.Kep'].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <Autocomplete
          className='wrappField'
          disablePortal
          id="combo-box-demo"
          onChange={this._handleChangeValuePraBedah}
          options={this.state.dataDxPrimary && this.state.dataDxPrimary[3]}
          fullWidth
          renderInput={(params) =>
            <TextField {...params} label="Diagnosa Primary" onChange={this._changeValPraBedah} />
          }
        />
        <Autocomplete
          className='wrappField'
          disablePortal
          id="combo-box-demo"
          onChange={this._handleChangeValuePascaBedah}
          options={this.state.dataDxSecondary && this.state.dataDxSecondary[3]}
          fullWidth
          renderInput={(params) =>
            <TextField {...params} label="Diagnosa Secondary" onChange={this._changeValPascaBedah} />
          }
        />
        <Autocomplete
          className='wrappFieldTindakan'
          disablePortal
          id="combo-box-demo"
          onChange={this._handleChangeValueTindakan}
          options={this.state.dataDxTindakan && this.state.dataDxTindakan[3]}
          fullWidth
          renderInput={(params) =>
            <TextField {...params} label="Diagnosa Tindakan" onChange={this._changeValTindakan} />
          }
        />
        <TextField
          className='wrappField'
          id="outlined-select-currency"
          select
          label="Macam Pembedahan"
          fullWidth
          name='macamPembedahan'
          onChange={this._handleChangeValue}
          variant="outlined"
        >
          {['Besar', 'Sedang', 'Kecil', 'Elective', 'Khusus', 'Emergency'].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          className='wrappField'
          id="outlined-select-currency"
          select
          label="Jenis Pembedahan"
          fullWidth
          name='jenisPembedahan'
          onChange={this._handleChangeValue}
          variant="outlined"
        >
          {['Operasi Bedah Terbuka', 'Laparaskopi'].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          className='wrappField'
          label="Jaringan yang Dieksisi/ Insisi"
          fullWidth
          onChange={this._handleChangeValue}
          name='dieksisi'
          variant="outlined"
        />
        <FormControl className='wrappPA'>
          <FormLabel>Dikirim Untuk Pemeriksaan PA</FormLabel>
          <RadioGroup row onChange={this._handleChangesendPA} value={this.state.sendPA}>
            <FormControlLabel value="yes" control={<Radio />} label="Ya" />
            <FormControlLabel value="no" control={<Radio />} label="Tidak" />
          </RadioGroup>
        </FormControl>
      </Grid>
    );
  }

  _renderRight = () => {
    return (
      <Grid item xs={4}>
        <TextField
          className='wrappFieldAnastesi'
          id="outlined-select-currency"
          select
          label="Jenis Anastesi"
          fullWidth
          name='anastesi'
          onChange={this._handleChangeValue}
          variant="outlined"
        >
          {['Anestesi Lokal', 'Anestesi Umum'].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['TimePicker', 'TimePicker']}>
            <TimePicker
              className='wrappTimePicker'
              label="Jam Operasi Dimulai"
              onChange={this._handleChangeJamMulai}
            />
          </DemoContainer>
          <DemoContainer components={['TimePicker', 'TimePicker']}>
            <TimePicker
              className='wrappTimePicker'
              label="Jam Operasi Berakhir"
              onChange={this._handleChangeJamAkhir}
            />
          </DemoContainer>
        </LocalizationProvider>
        <TextField
          className='wrappRangeTimeOperasi'
          label="Lama Operasi"
          InputProps={{
            endAdornment: <InputAdornment position="end">Jam</InputAdornment>,
          }}
          variant="outlined"
          onChange={this._handleChangeJamOperasi}
          value={this.state.durasiOperasi?.jam}
        />
        <TextField
          className='wrappRangeTimeOperasi'
          InputProps={{
            endAdornment: <InputAdornment position="end">Menit</InputAdornment>,
          }}
          variant="outlined"
          onChange={this._handleChangeMenitOperasi}
          value={this.state.durasiOperasi?.menit}
        />
        <TextField
          className='wrappFieldArea'
          label="Laporan Opeasi"
          fullWidth
          multiline
          name='laporanOperasi'
          onChange={this._handleChange}
          rows={11}
          variant="outlined"
          type='area'
          value={this.state.laporanOperasi}
          helperText={`${this.state.laporanOperasi.length}/200`}
        />
      </Grid>
    );
  }

  _renderMenu = () => {
    const { showMenu } = this.state;
    return (
      <div
        className={showMenu ? 'menu' : 'menuHide'}
      >
        <IconButton className='burgerWhite' onClick={this._handleMenu}>
          <Close />
        </IconButton>
        <nav>
          <div onClick={this._handleContent('listPatient')}>
            <FormatListBulleted /> Daftar Pasien
          </div>
          <div onClick={this._handleContent('addPatient')}>
            <PersonAddAlt /> Tambah Pasien
          </div>
          <div style={{ position: 'absolute', bottom: '20px' }} onClick={this._handleContent('logout')}>
            <Logout /> Logout
          </div>
        </nav>
      </div>
    );
  }

  _renderMenuAddPatient = () => {
    return (
      <React.Fragment>
        <div className='containerHeader'>
          <div className='titleForm'>FORMULIR LAPORAN OPERASI</div>
          <IconButton onClick={this._handleMenu}>
            <Menu />
          </IconButton>
        </div>
        <Grid container className='form' spacing={2}>
          {this._renderLeft()}
          {this._renderCenter()}
          {this._renderRight()}
        </Grid>
        <div className='containerButton'>
          <Button
            disabled={
              this.state.noRM === '' || this.state.fullName === '' ||
                this.state.age === '' || this.state.gender === '' ||
                this.state.drBedah === '' || this.state.drAnastesi === '' ||
                this.state.dateOperasi === '' || this.state.ruangan === '' ||
                this.state.perawat === '' || this.state.dxPraBedah === '' ||
                this.state.dxPascaBedah === '' || this.state.macamPembedahan === '' ||
                this.state.jenisPembedahan === '' || this.state.dieksisi === '' ||
                this.state.anastesi === '' || this.state.jamMulai === '' ||
                this.state.jamAkhir === '' || this.state.durasiOperasi?.jam === '' ||
                this.state.durasiOperasi?.menit === '' || this.state.laporanOperasi === '' ||
                this.state.dxTindakan === '' ? true : false
            }
            className='btnSimpan'
            onClick={this._handleSaveData()}
            variant='contained'
          >
            Simpan
          </Button>
          <Button
            color="error"
            onClick={this._handleContent('listPatient')}
            variant='outlined'
          >
            Kembali
          </Button>
        </div>
      </React.Fragment>
    );
  }

  _renderMenuListPatient = () => {
    return (
      <div>
        <div className='containerHeader'>
          <div className='titleForm'>LIST PASIEN OPERASI</div>
          <IconButton onClick={this._handleMenu}>
            <Menu />
          </IconButton>
        </div>
        <FormControl>
          <OutlinedInput
            endAdornment={
              <InputAdornment>
                <Search />
              </InputAdornment>
            }
            onChange={this._handleChangeSearch}
            placeholder="Cari pasien..."
            type="text"
            value={this.state.search}
            variant="outlined"
            size='small'
          />
        </FormControl>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>NO RM</b></TableCell>
                <TableCell><b>NAMA</b></TableCell>
                <TableCell><b>TANGGAL OPERASI</b></TableCell>
                <TableCell><b>DOKTER BEDAH</b></TableCell>
                <TableCell><b>DOKTER ANASTESI</b></TableCell>
                <TableCell><b>DIAGNOSA PRIMARY</b></TableCell>
                <TableCell><b>DIAGNOSA SECONDARY</b></TableCell>
                <TableCell><b>RUANGAN</b></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(this.state.dataTable || []).map((val, idx) => {
                return (
                  <TableRow key={idx}>
                    <TableCell>{val?.noRM}</TableCell>
                    <TableCell>{val?.fullName}</TableCell>
                    <TableCell>{val?.dateOperasi}</TableCell>
                    <TableCell>{val?.drBedah}</TableCell>
                    <TableCell>{val?.drAnastesi}</TableCell>
                    <TableCell>{val?.dxPraBedah}</TableCell>
                    <TableCell>{val?.dxPascaBedah}</TableCell>
                    <TableCell>{val?.ruangan}</TableCell>
                    <TableCell>
                      <div style={{ display: 'flex' }}>
                        <IconButton onClick={this._handleShowHTML(val?.noRM)}><Print /></IconButton>
                        <IconButton onClick={this._handleDelete(val?.noRM)}><Delete /></IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer >
        {/* <Pagination
          className='wrappPagination'
          count={Math.ceil(this.state.dataTable.length / this.state.limit)}
          page={this.state.page}
          onChange={this._handleChangeRowsPerPage}
        /> */}
      </div >
    );
  }

  _renderModalSubmit = () => {
    return (
      <Modal open={this.state.modalSubmit}>
        <Box sx={styleModal}>
          {this.state.loading ?
            <CircularProgress size={42} /> :
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <CheckCircle color='success' sx={{ fontSize: 150 }} />
              <h3>Data Berhasil Tersimpan!</h3>
              <Button
                variant="contained"
                color="success"
                onClick={this._handleContent('listPatient')}
              >
                Lihat Tabel
              </Button>
            </div>
          }
        </Box>
      </Modal>
    );
  }

  _renderModalDelete = () => {
    const { pasienDelete } = this.state;
    return (
      <Modal open={this.state.modalDelete}>
        <Box sx={styleModal}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Help sx={{ color: 'red', fontSize: 150 }} />
            <Typography>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Yakin menghapus data pasien :</div>
              <Grid container spacing={2}>
                <Grid item sx={4}>
                  <div>No RM</div>
                  <div>Nama</div>
                  <div>dr Bedah</div>
                  <div>Ruangan</div>
                </Grid>
                <Grid item sx={1}>
                  <div>:</div>
                  <div>:</div>
                  <div>:</div>
                  <div>:</div>
                </Grid>
                <Grid item sx={7}>
                  <div>{pasienDelete && pasienDelete[0] && pasienDelete[0]?.noRM}</div>
                  <div>{pasienDelete && pasienDelete[0] && pasienDelete[0]?.fullName}</div>
                  <div>{pasienDelete && pasienDelete[0] && pasienDelete[0]?.drBedah}</div>
                  <div>{pasienDelete && pasienDelete[0] && pasienDelete[0]?.ruangan}</div>
                </Grid>
              </Grid>
            </Typography>
            <div style={{ width: '50%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
              <Button
                color="error"
                variant="contained"
                onClick={this._handleRemovePasien('delete', (pasienDelete && pasienDelete[0] && pasienDelete[0]?.noRM))}>
                Ya
              </Button>
              <Button variant="outlined" onClick={this._handleRemovePasien('back')}>Kembali</Button>
            </div>
          </div>
        </Box>
      </Modal>
    );
  }

  _renderModalForm = () => {
    let dataPasien = (this.state.dataTable || []).filter(val => val?.noRM === this.state.idData);
    return (
      <Modal open={this.state.showPreview}>
        <Box sx={styleModalForm}>
          <IconButton style={{
            position: 'absolute',
            top: -10,
            right: -10,
          }} onClick={this._handleClosePreview}>
            <Cancel fontSize='large' />
          </IconButton>
          <React.Fragment>
            <PDFViewer style={viewer}>
              <Document>
                <Page size="A4" style={page}>
                  <View style={section}>
                    <PreviewFrom data={dataPasien} />
                  </View>
                </Page>
              </Document>
            </PDFViewer>
          </React.Fragment>
        </Box>
      </Modal>
    );
  }

  _renderLogin = () => {
    const { showPassword, errorLogin } = this.state;
    return (
      <div style={{
        backgroundColor: '#dfe8ed',
        margin: '-30px',
        height: '100vh'
      }}
      >
        <Card sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: 500,
        }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <div className='img-login' />
            </Grid>
            <Grid item xs={6} style={{ marginTop: '40px', paddingLeft: '30px' }}>
              <div>
                <h1>Login</h1>
                <p>Silahkan login untuk masuk ke pendaftaran pasien Operasi</p>
              </div>
              <TextField
                error={errorLogin}
                style={{ width: '360px', marginTop: '20px' }}
                label='Username'
                name='nama'
                onChange={this._handleChangeLogin}
              />
              <FormControl sx={{ width: '360px', marginTop: '20px' }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  error={errorLogin}
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={this._handleClickShowPassword}
                        onMouseDown={this._handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                  name='password'
                  onChange={this._handleChangeLogin}
                />
              </FormControl>
              {errorLogin &&
                <div style={{ color: 'red' }}>Username dan Password tidak sesuai</div>
              }
              <Button
                disabled={
                  this.state.nama === '' ||
                    this.state.password === '' ? true : false
                }
                variant='contained'
                style={{ width: '360px', marginTop: '20px' }}
                onClick={this._handleLogin}
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </Card>
      </div>
    );
  }

  render() {
    const { menuListPatien, valLogin } = this.state;
    let content;
    if (valLogin) {
      if (menuListPatien) {
        content = this._renderMenuListPatient();
      } else {
        content = this._renderMenuAddPatient()
      }
    } else {
      content = this._renderLogin();
    }
    return (
      <React.Fragment>
        {this._renderMenu()}
        <div style={{ padding: '30px' }}>
          {this._renderModalForm()}
          {this._renderModalSubmit()}
          {this._renderModalDelete()}
          {content}
        </div>
      </React.Fragment>
    );
  }
}

export default Form;