import React, { Component } from 'react';
import moment from 'moment';
import { Text } from '@react-pdf/renderer';

class PreviewFrom extends Component {
  render() {
    const { data } = this.props;
    console.log('>>>', data);
    const person = data && data[0];
    return (
      <div style={{ border: '1px solid black' }}>
        <div style={{ borderBottom: '1px solid black', textAlign: 'right', padding: 5 }}>
          <Text style={{ fontSize: 18 }}>Hermina Arcamanik Hospital (RSU Hermina Arcamanik)</Text>
          <Text>Jl. A.H. Nasution No.50, Antapani Wetan, Kec. Antapani</Text>
          <Text>Kota Bandung, Jawa Barat 40291</Text>
          <Text>Phone: 022-87242525. Fax: 022-7271771</Text>
        </div>
        <div style={{ borderBottom: '1px solid black', textAlign: 'right', padding: 5 }}>
          <Text style={{ fontSize: 14, textAlign: 'center' }}>FORMULIR LAPORAN OPERASI</Text>
        </div>
        <div style={{ borderBottom: '1px solid black', padding: 5 }}>
          <Text>No RM : {person?.noRM}</Text>
        </div>
        <div style={{ borderBottom: '1px solid black', padding: 5 }}>
          <Text>Nama : {person?.fullName}</Text>
        </div>
        <div style={{ borderBottom: '1px solid black', padding: 5 }}>
          <Text>Umur : {person?.age}</Text>
        </div>
        <div style={{ borderBottom: '1px solid black', padding: 5 }}>
          <Text>Ruangan : {person?.ruangan}</Text>
        </div>
        <div style={{ borderBottom: '1px solid black', padding: 5 }}>
          <Text>Ahli Bedah : {person?.drBedah}</Text>
        </div>
        <div style={{ borderBottom: '1px solid black', padding: 5 }}>
          <Text>Ahli Anastesi : {person?.drAnastesi}</Text>
        </div>
        <div style={{ borderBottom: '1px solid black', padding: 5 }}>
          <Text>Perawat : {person?.perawat}</Text>
        </div>
        <div style={{ borderBottom: '1px solid black', padding: 5 }}>
          <Text>Diganosa Primary : {person?.dxPraBedah.map(val => val)?.join(' - ')?.toString()}</Text>
        </div>
        <div style={{ borderBottom: '1px solid black', padding: 5 }}>
          <Text>Diganosa Secondary : {person?.dxPascaBedah.map(val => val)?.join(' - ')?.toString()}</Text>
        </div>
        <div style={{ borderBottom: '1px solid black', padding: 5 }}>
          <Text>Diganosa Tindakan : {person?.dxTindakan.map(val => val)?.join(' - ')?.toString()}</Text>
        </div>
        <div style={{ borderBottom: '1px solid black', padding: 5 }}>
          <Text>Jenis Pembedahan : {person?.jenisPembedahan}</Text>
        </div>
        <div style={{ borderBottom: '1px solid black', padding: 5 }}>
          <Text>Macam Pembedahan : {person?.macamPembedahan}</Text>
        </div>
        <div style={{ borderBottom: '1px solid black', padding: 5 }}>
          <Text>Jaringan yang dieksisi/ insisi : {person?.dieksisi}</Text>
        </div>
        <div style={{ borderBottom: '1px solid black', padding: 5 }}>
          <Text>Dikirim untuk pemeriksaan PA : {person?.sendPA === 'no' ? 'Tidak' : 'Iya'}</Text>
        </div>
        <div style={{ borderBottom: '1px solid black', padding: 5 }}>
          <Text>Jenis Anastesi : {person?.anastesi}</Text>
        </div>
        <div style={{ borderBottom: '1px solid black', padding: 5 }}>
          <Text>Tgl. Operasi : {person?.dateOperasi}</Text>
        </div>
        <div style={{ borderBottom: '1px solid black', padding: 5 }}>
          <Text>Jam Operasi Dimulai : {person?.jamMulai}</Text>
        </div>
        <div style={{ borderBottom: '1px solid black', padding: 5 }}>
          <Text>Jam Operasi Berakhir : {person?.jamAkhir}</Text>
        </div>
        <div style={{ borderBottom: '1px solid black', padding: 5 }}>
          <Text>Lama Operasi : {person?.durasiOperasi?.jam} Jam {person?.durasiOperasi?.menit} Menit</Text>
        </div>
        <div style={{ borderBottom: '1px solid black', padding: 5 }}>
          <Text>Laporan Operasi :</Text>
          <Text>{person?.laporanOperasi}</Text>
          <Text style={{ textAlign: 'right', padding: 5 }}>Bandung, {moment().format('DD MMMM YYYY')}</Text>
          <Text style={{ textAlign: 'right', padding: 5, marginBottom: 50 }}>Dokter Ahli Bedah</Text>
          <Text style={{ textAlign: 'right', padding: 5 }}>{person?.drBedah}</Text>
        </div>
      </div>
    );
  }
}

export default PreviewFrom;